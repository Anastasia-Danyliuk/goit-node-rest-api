import Contact from "../models/ContactModel.js";

export const listContacts = (userId) => Contact.findAll({ where: { owner: userId } });

export const getContactById = (id, userId) => Contact.findOne({ where: { id, owner: userId } });

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, userId, data) => Contact.update(data, {
    where: { id, owner: userId},
    returning: true
});

export const removeContact = (id, userId) => Contact.destroy({ where: { id, owner: userId  } });

export const updateStatusContact = async (id, favorite, userId) => {
    const contact = await Contact.findOne({ where: { id, owner: userId } });
    if (!contact) return null;

    contact.favorite = favorite;
    return await contact.save();
};