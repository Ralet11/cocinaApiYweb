import { Sequelize } from "sequelize";


const sequelize = new Sequelize("cocina", "postgres", "02324aaA!", {
    host:"localhost", 
    dialect:"postgres",
    logging: false
})
export default sequelize
