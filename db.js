import { Sequelize } from 'sequelize'
import 'dotenv/config';

export const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};