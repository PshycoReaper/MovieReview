const express = require("express");
const router = express.Router();

const asyncHandler = require("../../utils/async-handler.util");
const contactService = require("./contact.service");

router.post(
    "/postContactRequest",
    asyncHandler(async (req, res) => {
        const savedRequest = await contactService.submitContactRequest(req.body);
        res.status(201).json(savedRequest);
    })
);

router.get(
    "/getContactRequests",
    asyncHandler(async (req, res) => {
        const requests = await contactService.listContactRequests(req.query);
        res.status(200).json(requests);
    })
);

router.get(
    "/getContactRequest/:id",
    asyncHandler(async (req, res) => {
        const request = await contactService.getContactRequestDetail(req.params.id);
        res.status(200).json(request);
    })
);

router.put(
    "/updateContactRequest/:id",
    asyncHandler(async (req, res) => {
        const result = await contactService.updateContactRequest(req.params.id, req.body);
        res.status(200).json(result);
    })
);

router.delete(
    "/deleteContactRequest/:id",
    asyncHandler(async (req, res) => {
        const result = await contactService.removeContactRequest(req.params.id);
        res.status(200).json(result);
    })
);

module.exports = router;
