import mysql from 'mysql2/promise';

// Configuración directa de la base de datos
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'radiopad'
};

async function createTestPrograms() {
    try {
        const connection = await mysql.createConnection(DB_CONFIG);

        console.log('=== CREANDO PROGRAMAS DE PRUEBA ===');
        
        // Crear programa activo de prueba
        await connection.execute(
            'INSERT INTO programs (name, description, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            ['Programa Test Activo', 'Programa de prueba activo', 'Active']
        );
        
        // Crear programa inactivo de prueba
        await connection.execute(
            'INSERT INTO programs (name, description, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            ['Programa Test Inactivo', 'Programa de prueba inactivo', 'Inactive']
        );
        
        console.log('Programas de prueba creados exitosamente');
        
        // Verificar todos los programas
        const [programs] = await connection.execute('SELECT * FROM programs ORDER BY id');
        console.log('\nTotal de programas ahora:', programs.length);
        programs.forEach(program => {
            console.log(`- ID: ${program.id}, Nombre: ${program.name}, Estado: ${program.status}`);
        });

        await connection.end();
        
    } catch (error) {
        console.error('Error creando programas de prueba:', error);
    }
}

createTestPrograms();