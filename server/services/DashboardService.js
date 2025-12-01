import moment from 'moment';
import 'moment/locale/es.js';

class DashboardService {
    constructor(conex) {
        this.conex = conex;

        // Configurar moment en español
        moment.locale('es');
    }

    // Obtener datos para el dashboard
    getData = async () => {
        try {
            const [programs] = await this.conex.query(`
                SELECT COUNT(id) as totalPrograms FROM programs
            `);

            const [sounds] = await this.conex.query(`
                SELECT COUNT(sound_id) as totalSounds FROM sound_effects
            `);

            const [users] = await this.conex.query(`
                SELECT COUNT(user_id) as totalUsers FROM users
            `);

            const [lastProgram] = await this.conex.query(`
                SELECT name, created_at FROM programs ORDER BY id DESC LIMIT 1
            `);

            const [lastSound] = await this.conex.query(`
                SELECT sound_name, created_at FROM sound_effects ORDER BY sound_id DESC LIMIT 1
            `);

            const [lastUser] = await this.conex.query(`
                SELECT name, created_at FROM users ORDER BY user_id DESC LIMIT 1
            `);

            return {
                totalPrograms: programs[0].totalPrograms,
                totalSounds: sounds[0].totalSounds,
                totalUsers: users[0].totalUsers,
                lastProgram: {
                    name: lastProgram[0].name || '',
                    time: lastProgram[0].created_at ? moment(lastProgram[0].created_at).fromNow() : ''
                },
                lastSound: {
                    name: lastSound[0].sound_name || '',
                    time: lastSound[0].created_at ? moment(lastSound[0].created_at).fromNow() : ''
                },
                lastUser: {
                    name: lastUser[0].name || '',
                    time: lastUser[0].created_at ? moment(lastUser[0].created_at).fromNow() : ''
                }
            };
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los datos del dashboard', cause: error };
        }
    };

}

export default DashboardService;