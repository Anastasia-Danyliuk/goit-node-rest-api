import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try{
        const { id: userId } = req.user;
        const result = await contactsService.listContacts(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = await contactsService.getContactById(id,userId);
        if(!result) throw HttpError(404);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = await contactsService.removeContact(id, userId);
        if(!result) throw HttpError(404);
        res.status(200).json({ id });
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try{
        const { id: userId } = req.user;
        const result = await contactsService.addContact({...req.body, owner: userId});
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = await contactsService.updateContactById(id, userId, req.body);
        if (!result || result[0] === 0) throw HttpError(404);
        res.status(200).json(result[1][0]);
    }catch(error){
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const {favorite} = req.body;

        const result = await contactsService.updateStatusContact(id, userId, favorite);
        if (!result) throw HttpError(404);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
