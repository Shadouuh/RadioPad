import React, { useEffect, useState } from 'react';
import { FaTimes, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import './ProgramModal.css';
import ProgramService from '../../../shared/services/ProgramService.js';
import UserService from '../../../shared/services/UserService.js';

const AssignUsersModal = ({ isOpen, onClose, program, canManage }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!isOpen || !program) return;
      const pid = Number(program?.id);
      if (!Number.isFinite(pid)) {
        setError('Programa inválido: ID no numérico');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const [usersRes, assignedRes] = await Promise.all([
          UserService.getAllUsers(),
          ProgramService.getProgramUsers(pid)
        ]);

        const users = usersRes?.data || [];
        const assigned = assignedRes?.data || [];
        setAllUsers(users);
        // Normalizar IDs (los asignados vienen como user_id)
        setAssignedUserIds(new Set(assigned.map(u => Number(u.user_id))));
      } catch (err) {
        setError(err?.response?.data?.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isOpen, program]);

  // Asegurar comparación consistente (número)
  const isAssigned = (userId) => assignedUserIds.has(Number(userId));

  const toggleAssign = async (user) => {
    if (!canManage) return;
    setSaving(true);
    setError('');
    try {
      const pid = Number(program?.id);
      if (!Number.isFinite(pid)) {
        setError('Programa inválido: ID no numérico');
        return;
      }
      if (isAssigned(user.id)) {
        const res = await ProgramService.unassignProgramFromUser(user.id, pid);
        if (res?.success) {
          setAssignedUserIds(prev => {
            const next = new Set(prev);
            next.delete(user.id);
            return next;
          });
        } else {
          setError('No se pudo desasignar el usuario');
        }
      } else {
        const res = await ProgramService.assignProgramToUser(user.id, pid);
        if (res?.success) {
          setAssignedUserIds(prev => new Set([...prev, user.id]));
        } else {
          setError('No se pudo asignar el usuario');
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al actualizar asignación');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !program) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Asignar usuarios a "{program.name}"</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: 8,
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {allUsers.length === 0 ? (
                <p>No hay usuarios disponibles</p>
              ) : (
                allUsers.map(user => (
                  <button
                    key={user.id}
                    className={`user-option ${isAssigned(user.id) ? 'active' : ''}`}
                    onClick={() => toggleAssign(user)}
                    disabled={!canManage || saving}
                    title={isAssigned(user.id) ? 'Desasignar' : 'Asignar'}
                  >
                    <div className="user-option-avatar">
                      {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="user-option-info">
                      <span className="user-option-name">{user.name}</span>
                      <span className="user-option-role">{user.role}</span>
                    </div>
                    {isAssigned(user.id) ? <FaUserCheck style={{ marginLeft: 'auto' }} /> : <FaUserPlus style={{ marginLeft: 'auto' }} />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignUsersModal;