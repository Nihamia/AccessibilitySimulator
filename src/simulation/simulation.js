export class Simulation {

    constructor() {

        this.objects = [];

    }

    add(object) {

        this.objects.push(object);

    }

    update(delta) {

        this.objects.forEach(object => {

            object.update(delta);

        });

    }

}