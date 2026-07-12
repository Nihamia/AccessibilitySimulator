export class World {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
    }

    add(object) {
        this.objects.push(object);
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);

        this.objects = this.objects.filter(
            obj => obj !== object
        );
    }

    getObjects() {
        return this.objects;
    }
}