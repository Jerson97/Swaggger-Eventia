const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Eventos:
 *       type: object
 *       required:
 *         - name
 *         - costo
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the evento
 *         name:
 *           type: string
 *           description: the name of the evento
 *         costo:
 *           type: string
 *           description: S/
 *       example:
 *         id: d5fE_asz
 *         name: Animación
 *         costo: s/5000
 */

 /**
  * @swagger
  * tags:
  *   name: Eventos
  *   description: The eventos managing API
  */

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Returns the list of all the eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: The list of the eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Eventos'
 */

router.get("/", (req, res) => {
	const eventos = req.app.db.get("eventos");

	res.send(eventos);
});

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Get the eventos by id
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The evento id
 *     responses:
 *       200:
 *         description: The evento description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Eventos'
 *       404:
 *         description: The evento was not found
 */

router.get("/:id", (req, res) => {
  const evento = req.app.db.get("eventos").find({ id: req.params.id }).value();

  if(!evento){
    res.sendStatus(404)
  }

	res.send(evento);
});

/**
 * @swagger
 * /eventos:
 *   post:
 *     summary: Create a new evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       200:
 *         description: The evento was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
	try {
		const evento = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.db.get("eventos").push(evento).write();
    
    res.send(evento)
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /evento/{id}:
 *  put:
 *    summary: Update the evento by the id
 *    tags: [Eventos]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The evento id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Evento'
 *    responses:
 *      200:
 *        description: The evento was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Evento'
 *      404:
 *        description: The evento was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.db
			.get("eventos")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.db.get("eventos").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Remove the evento by id
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The evento id
 * 
 *     responses:
 *       200:
 *         description: The evento was deleted
 *       404:
 *         description: The evento was not found
 */

router.delete("/:id", (req, res) => {
	req.app.db.get("eventos").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;
