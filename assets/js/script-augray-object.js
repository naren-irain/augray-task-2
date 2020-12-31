setTimeout(function(){
    document.getElementById('app_loader').style.display = "none";
    document.getElementById('main').style.display = "block";
    init();
    animate();
}, 300 );

if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

var container = document.getElementById("modal_container");
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;

function init() {

    /* Camera */
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 3;

    /* Scene */
    scene = new THREE.Scene();
    lighting = false;

    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    /* Model */
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl('assets/img/uploads/');
    mtlLoader.setPath('assets/img/uploads/');
    mtlLoader.load('female-croupier-2013-03-26.mtl', function (materials) {
        materials.preload();

        materials.materials.default.map.magFilter = THREE.NearestFilter;
        materials.materials.default.map.minFilter = THREE.LinearFilter;

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('assets/img/uploads/');
        objLoader.load('female-croupier-2013-03-26.obj', function (object) {
            scene.add(object);
        });
    });

    /* Renderer */
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    //renderer.setClearColor(new THREE.Color(0x000000, 0));

    container.appendChild(renderer.domElement);

    /* Controls */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    /* Events */
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyboardEvent, false);
}


function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}


function onKeyboardEvent(e) {
    if (e.code === 'KeyL') {
        lighting = !lighting;

        if (lighting) {
            ambient.intensity = 0.25;
            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);
        } else {
            ambient.intensity = 1.0;
            scene.remove(keyLight);
            scene.remove(fillLight);
            scene.remove(backLight);

        }
    }
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}


function render() {
    renderer.render(scene, camera);
}
