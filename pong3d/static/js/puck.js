class Puck {
    constructor(puckSize = 1, height = 1, color = 0x0000ff, puckSpeed = 1, initialPosition = new THREE.Vector3(0, 0, 0)) {
        const radialSegments = 32; // Segments radiaux pour une surface lisse
        this.puckSpeed = puckSpeed;
        this.puckSize = puckSize;
        this.initialPosition = initialPosition;
        this.initialSpeed = puckSpeed;
        this.puckDirection = new THREE.Vector3(0, puckSpeed, 0);
        this.geometry = new THREE.CylinderGeometry(puckSize, puckSize, height, radialSegments);
        this.material = new THREE.MeshStandardMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Orienter le cylindre le long de l'axe Z
        this.mesh.rotation.x = Math.PI / 2; // 90 degrés autour de l'axe X
    }

    getMesh() {
        return this.mesh;
    }
    // Ajouter un getter pour accéder à la position du maillage
    get position() {
        return this.mesh.position;
    }

    // Ajouter un getter pour accéder à la rotation du maillage
    get rotation() {
        return this.mesh.rotation;
    }
    get size() {
        return this.puckSize;
    }
    // Ajouter un getter pour accéder à la vitesse du palet
    get speed() {
        return this.puckSpeed;
    }

    // Ajouter un setter pour modifier la vitesse du palet
    set speed(value) {
        this.puckSpeed = value;
    }

    inverseDirectionY() {
        this.puckDirection.y *= -1;
    }
    inverseDirectionX() {
        this.puckDirection.x *= -1;
    }
    updatePosition() {
        this.mesh.position.x += this.puckDirection.x * this.puckSpeed;
        this.mesh.position.y += this.puckDirection.y * this.puckSpeed;
    }
    reset() {
        this.mesh.position.copy(this.initialPosition);
        this.puckSpeed = this.initialSpeed; // Vous pouvez ajuster la valeur de réinitialisation de la vitesse ici
    }
}