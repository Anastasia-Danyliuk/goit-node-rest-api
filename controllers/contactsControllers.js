import Contact from "../models/contactModel.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try{
        const result = await Contact.findAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try{
        const { id } = req.params;
        const result = await Contact.findByPk(id);
        if(!result) throw HttpError(404);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try{
        const { id } = req.params;
        const result = await Contact.destroy({where: {id}});
        if(!result) throw HttpError(404);
        res.status(200).json({ id });
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try{
        const result = await Contact.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try{
        const { id } = req.params;
        const [updatedRows] = await Contact.update(req.body, { where: { id } });
        if (updatedRows === 0) throw HttpError(404);
        const result = await Contact.findByPk(id);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {favorite} = req.body;

        const contact = await Contact.findByPk(id);
        if (!contact) throw HttpError(404);

        contact.favorite = favorite;
        await contact.save();

        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};
