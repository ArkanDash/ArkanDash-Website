import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js';
import Stats from 'three/examples/jsm/libs/stats.module';

const helper = new MMDAnimationHelper({afterglow:2.0})
let ikHelper, physicsHelper;
const loader = new MMDLoader()
const clock = new THREE.Clock();
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30)

const space = new THREE.TextureLoader().load('./bg.jpg')
scene.background = space

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement)

const stats = Stats()
document.body.appendChild(stats.dom)

Ammo().then( function ( AmmoLib ) {Ammo = AmmoLib;startup();animate();} );

function startup(){
	function onProgress( xhr ) {

		if ( xhr.lengthComputable ) {

			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

		}

	}
	
	loader.loadWithAnimation(
		'./model/paimon.pmx',
		'./model/paimon-idle.vmd',
		function ( mmd ) {
			
			scene.add( mmd.mesh );
	
			helper.add( mmd.mesh, {
				animation: mmd.animation,
				physics: true
			} );
	
			ikHelper = helper.objects.get( mmd.mesh ).ikSolver.createHelper();
			ikHelper.visible = false;
			scene.add( ikHelper );
			helper.enable( 'animation', true);
	
			physicsHelper = helper.objects.get( mmd.mesh ).physics.createHelper();
			physicsHelper.visible = false;
			scene.add( physicsHelper );
			helper.enable( 'ik', true );
		}
	), onProgress, null}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update()
}
function render() {
	helper.update( clock.getDelta() );
	renderer.render( scene, camera );

}
