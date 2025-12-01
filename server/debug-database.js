import mysql from 'mysql2/promise';

// Configuración directa de la base de datos
const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'radiopad'
};

async function debugDatabase() {
    try {
        // Conexión a la base de datos
        const connection = await mysql.createConnection(DB_CONFIG);

        console.log('=== DEBUG BASE DE DATOS ===');
        
        // Verificar programas
        console.log('\n1. Verificando programas en la base de datos:');
        const [programs] = await connection.execute('SELECT * FROM programs');
        console.log(`Total de programas: ${programs.length}`);
        programs.forEach(program => {
            console.log(`- ID: ${program.id}, Nombre: ${program.name}, Estado: ${program.status}`);
        });

        // Verificar usuario Admin
        console.log('\n2. Verificando usuario Admin:');
        const [adminUsers] = await connection.execute(
            'SELECT user_id, name, email, role, program_id FROM users WHERE role = ?',
            ['Jefe de Operadores']
        );
        console.log(`Usuarios Jefe de Operadores encontrados: ${adminUsers.length}`);
        adminUsers.forEach(user => {
            console.log(`- ID: ${user.user_id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}, Program_ID: ${user.program_id}`);
        });

        // Verificar todos los usuarios
        console.log('\n3. Todos los usuarios:');
        const [allUsers] = await connection.execute('SELECT user_id, name, email, role, program_id FROM users');
        console.log(`Total de usuarios: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`- ID: ${user.user_id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}, Program_ID: ${user.program_id}`);
        });

        // Verificar relaciones usuario-programa
        console.log('\n4. Verificando relaciones usuario-programa:');
        const [userPrograms] = await connection.execute(`
            SELECT u.user_id, u.name as user_name, u.role, u.program_id, p.name as program_name
            FROM users u
            LEFT JOIN programs p ON u.program_id = p.id
            ORDER BY u.user_id
        `);
        console.log(`Relaciones encontradas: ${userPrograms.length}`);
        userPrograms.forEach(rel => {
            console.log(`- Usuario: ${rel.user_name} (${rel.role}) -> Programa: ${rel.program_name || 'SIN PROGRAMA'}`);
        });

        await connection.end();
        console.log('\n=== FIN DEBUG BASE DE DATOS ===');

    } catch (error) {
        console.error('Error al debuggear base de datos:', error);
    }
}

debugDatabase().catch(console.error);