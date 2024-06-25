document.addEventListener('DOMContentLoaded', function() {
    console.log('Script pong3d.js chargé');

    // Initialisation de la scène, de la caméra et du renderer avec antialiasing activé
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    console.log('Renderer ajouté au DOM');

    // Ajout d'OrbitControls
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Permet un mouvement fluide
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.enableKeys = false;

    // Position initiale de la caméra
    camera.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);
    controls.update();

    // Sauvegarder l'état initial de la caméra
    controls.saveState();

    // Ajouter un bouton pour réinitialiser la caméra
    document.getElementById('resetButton').addEventListener('click', function() {
        controls.reset();
        console.log('Camera reset');
    });

    // Variables de jeu
    var paddleWidth = 3.7, paddleHeight = 0.1, paddleDepth = 0.2;
    var ballSize = 0.1;
    var paddleSpeed = 0.1, ballSpeed = 0.02;
    var score1 = 0, score2 = 0;

    // Création des paddles
    var paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    var paddleMaterial1 = new THREE.MeshBasicMaterial({ color: 0x33ccff });
    var paddleMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff2975 });
    var paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial1);
    var paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);

    // Positionnement des paddles
    paddle1.position.set(0, -2.5, 0);
    paddle2.position.set(0, 2.5, 0);
    scene.add(paddle1);
    scene.add(paddle2);
    console.log('Paddles ajoutés à la scène');

    // Création de la balle
    var ballGeometry = new THREE.SphereGeometry(ballSize, 32, 32);
    var ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0, 0);
    scene.add(ball);
    console.log('Balle ajoutée à la scène');

    // Création des bords
    var borderThickness = 0.1;
    var borderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    var borderTop = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth / window.innerHeight * 2, borderThickness, 0.2), borderMaterial);
    var borderBottom = new THREE.Mesh(new THREE.BoxGeometry(window.innerWidth / window.innerHeight * 2, borderThickness, 0.2), borderMaterial);
    var borderLeft = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 6, 0.2), borderMaterial);
    var borderRight = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 6, 0.2), borderMaterial);

    borderTop.position.set(0, 3.1, 0);
    borderBottom.position.set(0, -3.1, 0);
    borderLeft.position.set(-window.innerWidth / window.innerHeight, 0, 0);
    borderRight.position.set(window.innerWidth / window.innerHeight, 0, 0);

    scene.add(borderTop);
    scene.add(borderBottom);
    scene.add(borderLeft);
    scene.add(borderRight);
    console.log('Bords ajoutés à la scène');

    // Position de la caméra
    camera.position.z = 5;

    // Variables de mouvement
    var ballDirection = new THREE.Vector3(ballSpeed, ballSpeed, 0);

    // Drapeaux pour les touches de déplacement
    var moveLeft1 = false, moveRight1 = false;
    var moveLeft2 = false, moveRight2 = false;

    // Gestion des mouvements des paddles
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowLeft') {
            moveLeft1 = true;
        } else if (event.code === 'ArrowRight') {
            moveRight1 = true;
        }
        if (event.code === 'KeyA') {
            moveLeft2 = true;
        } else if (event.code === 'KeyD') {
            moveRight2 = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.code === 'ArrowLeft') {
            moveLeft1 = false;
        } else if (event.code === 'ArrowRight') {
            moveRight1 = false;
        }
        if (event.code === 'KeyA') {
            moveLeft2 = false;
        } else if (event.code === 'KeyD') {
            moveRight2 = false;
        }
    });

    // Fonction de mise à jour des scores
    function updateScores() {
        document.getElementById('score1').innerText = score1;
        document.getElementById('score2').innerText = score2;
    }

    // Création de l'explosion
    var particleCount = 10;
    var particles = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    var velocities = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        velocities[i * 3] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;

        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true
    });

    var particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    function triggerExplosion(position) {
        for (var i = 0; i < particleCount; i++) {
            particles.attributes.position.array[i * 3] = position.x;
            particles.attributes.position.array[i * 3 + 1] = position.y;
            particles.attributes.position.array[i * 3 + 2] = position.z;

            particles.attributes.velocity.array[i * 3] = (Math.random() - 0.5) * 2;
            particles.attributes.velocity.array[i * 3 + 1] = (Math.random() - 0.5) * 2;
            particles.attributes.velocity.array[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }
        particles.attributes.position.needsUpdate = true;
        particles.attributes.velocity.needsUpdate = true;
    }

    // Fonction de réinitialisation de la balle
    function resetBall() {
        ballSpeed = 0.02;
        ball.position.set(0, 0, 0);
        ballDirection.set(ballSpeed * (Math.random() > 0.5 ? 1 : -1), ballSpeed * (Math.random() > 0.5 ? 1 : -1), 0);
    }

    // Fonction de détection des collisions
    function checkCollision() {
        // Collision avec les paddles
        if (ball.position.y - ballSize <= paddle1.position.y + paddleHeight / 2 &&
            ball.position.x >= paddle1.position.x - paddleWidth / 2 &&
            ball.position.x <= paddle1.position.x + paddleWidth / 2) {
                ballDirection.y = ballSpeed;
                ballSpeed *= 1.1;
				triggerExplosion(ball.position.clone());
			}
			
			if (ball.position.y + ballSize >= paddle2.position.y - paddleHeight / 2 &&
            ball.position.x >= paddle2.position.x - paddleWidth / 2 &&
            ball.position.x <= paddle2.position.x + paddleWidth / 2) {
				ballDirection.y = -ballSpeed;
                ballSpeed *= 1.1;
				triggerExplosion(ball.position.clone());
			}
			
			// Collision avec les bords
			if (ball.position.x - ballSize <= -window.innerWidth / window.innerHeight) {
				ballDirection.x = ballSpeed;
				triggerExplosion(ball.position.clone());
        }

        if (ball.position.x + ballSize >= window.innerWidth / window.innerHeight) {
            ballDirection.x = -ballSpeed;
			triggerExplosion(ball.position.clone());
        }

        // Collision avec les bords supérieur et inférieur
        if (ball.position.y - ballSize <= -3) {
            score2++;
            triggerExplosion(ball.position.clone());
            updateScores();
            resetBall();
        }

        if (ball.position.y + ballSize >= 3) {
            score1++;
            triggerExplosion(ball.position.clone());
            updateScores();
            resetBall();
        }
    }

    // Fonction d'animation
    var animate = function() {
        requestAnimationFrame(animate);

        // Mise à jour des positions des paddles
        if (moveLeft1) paddle1.position.x -= paddleSpeed;
        if (moveRight1) paddle1.position.x += paddleSpeed;
        if (moveLeft2) paddle2.position.x -= paddleSpeed;
        if (moveRight2) paddle2.position.x += paddleSpeed;

        ball.position.add(ballDirection);
        checkCollision();

        // Mise à jour des particules pour l'explosion
        var positions = particles.attributes.position.array;
        var velocities = particles.attributes.velocity.array;
        for (var i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3] * 0.1;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.1;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.1;
        }
        particles.attributes.position.needsUpdate = true;

        controls.update(); // Met à jour les contrôles

        renderer.render(scene, camera);
    };

    // Initialiser les scores
    updateScores();
    // Initialiser la position de la balle
    resetBall();

    animate();
    console.log('Animation démarrée');
});
