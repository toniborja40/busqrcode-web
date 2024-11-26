import { Schema, model, models } from "mongoose";

const fiscales = new Schema(
  {
    numero: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    ubicacion: {   
        type: String,
        required: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.fiscales || model("fiscales", fiscales);