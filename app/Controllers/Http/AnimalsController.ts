import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Animal from 'App/Models/Animal'

export default class AnimalsController {
    public async setRegistrarAnimal({request, response}: HttpContextContract) {
        try {
            const dataAnimal = request.only(['codigo_animal','nombre_animal','especie','raza','genero','edad'])
            const codigoAnimal = dataAnimal.codigo_animal
            const animalExistente: Number = await this.getValidarAnimalExistente(codigoAnimal)
            if (animalExistente === 0) {
                await Animal.create(dataAnimal)
                response.status(200).json({"msg":"Registro de animal completado!!!"})
            }
            else {
                response.status(400).json({"msg":"Error, el codigo del animal ya existe!!!"})
            }
        }
        catch(error) {
            console.log(error)
            response.status(500).json({"msg":"Error en el servidor!!!"})
        }
    }

    private async getValidarAnimalExistente(codigo_animal: Number): Promise<Number> {
        const total = await Animal.query().where({"codigo_animal":codigo_animal}).count('*').from('animals')
        return parseInt(total[0]['count(*)'])
    }

    public async getListarAnimales(): Promise<Animal[]> {
        const animal = await Animal.all()
        return animal
    }

    public async getListarEspecie({request}: HttpContextContract) {
        const {especie} = request.all()
        const animals = await Animal.query().where({'especie':especie})
        return animals
    }

    public async getListarMenores({request}: HttpContextContract) {
        const {edad} = request.all()
        const animals = await Animal.query().where('edad','<',edad)
        return animals
    }

    public async actualizarAnimal({request}: HttpContextContract) {
        const {codigo_animal} = request.all()
        const datos = request.all();

        await Animal.query().where('codigo_animal',codigo_animal).update({
            nombre_animal: datos.nombre_animal,
            especie: datos.especie,
            raza: datos.raza,
            genero: datos.genero,
            edad: datos.edad,
        })
        return {"msg":"Actualizaciion finalizada con exito"}
    }

    public async eliminarAnimal({request}: HttpContextContract) {
        const {codigo_animal} = request.all()
        await Animal.query().where('codigo_animal',codigo_animal).delete()
        return {"msg":"Animal eliminado con exito!!!"}
    }
}
