exports.getPrivateData = (req, res, next) => {
    res.status(200).send({
        success: true,
        data: "You get access to the private data in this route"
    })
}