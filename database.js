import { Sequelize } from "sequelize";


const sequelize = new Sequelize("proyectoCocina", "postgres", "admin", {
    host:"localhost", 
    dialect:"postgres",
    logging: false
})
export default sequelize
