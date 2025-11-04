import handleError from '../utils/handleError.js';

class DashboardController {
    constructor(DashboardService) {
        this.DashboardService = DashboardService;
    }

    // Obtener datos para el dashboard
    getData = async (req, res) => {
        try {
            const data = await this.DashboardService.getData();
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default DashboardController;