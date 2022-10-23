import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js';

//Variable
const helper = new MMDAnimationHelper({afterglow:2.0})
let ikHelper, physicsHelper;
const clock = new THREE.Clock();
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')})
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000)

//Set the screen size at native screen
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

//Background
const space = new THREE.TextureLoader().load('./bg.jpg')
scene.background = space

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 0, 0 );
controls.update();
Ammo().then( function ( AmmoLib ) {Ammo = AmmoLib;startup();animate();} );

//Startup the model and placement
async function startup(){
	const mmdLoader = new MMDLoader()
	mmdLoader.loadWithAnimation(
		'./model/可莉2.0.pmx',
		'./model/Friday13thMemeDance.vmd',
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
			
			mmd.mesh.position.set(0, -10, -25)

			new THREE.AudioLoader().load(
				'./model/CaliforniaGurls.wav',
				function ( buffer ) {
	
					const listener = new THREE.AudioListener();
					const audio = new THREE.Audio( listener ).setBuffer( buffer );
	
					listener.position.z = 0;
	
					scene.add( audio );
					scene.add( listener );
	
				}
	
			);
		},
		function( xhr ) {
			if ( xhr.lengthComputable ) {
				const percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
			}
		}
	)
}
		
		
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	helper.update( clock.getDelta() );
	renderer.render( scene, camera );
}
