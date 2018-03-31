import { Component } from '@angular/core';
import { NavController,LoadingController,NavParams,ViewController,AlertController} from 'ionic-angular';
import { Http, Headers,RequestOptions } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

 
 
    sourceSelection;
    submitAttempt: boolean = false;
    image : any;
    text;

   

    base64Image:any;
 
    constructor(private http:Http,public navCtrl: NavController,private androidPermissions: AndroidPermissions, public navParams: NavParams,public viewCtrl: ViewController,public camera:Camera, public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
        
            firebase.initializeApp( {
              apiKey: "AIzaSyDeNSba3VyP2wqyNSsLVczs7bTmjQZ0raE",
                authDomain: "myproject-33459.firebaseapp.com",
                databaseURL: "https://myproject-33459.firebaseio.com",
                projectId: "myproject-33459",
                storageBucket: "myproject-33459.appspot.com",
                messagingSenderId: "856631011976"
            });
          


           this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            success => console.log('Permission granted'),
            err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
          );
   
    }


    takePicture(source){
     
             
         if(source=="camera"){
            this.sourceSelection = this.camera.PictureSourceType.CAMERA;
         }else if(source=="gallery"){
            this.sourceSelection = this.camera.PictureSourceType.PHOTOLIBRARY;
            // alert(source);
        }
          this.camera.getPicture({
              sourceType:this.sourceSelection,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              quality: 100
           }).then((imageData) => {
             this.base64Image = "data:image/jpeg;base64," + imageData;
          }, (err) => {
              console.log(err);
              alert(err);
             
          });
    }


    save(){

      if(this.text){
        
        let storageRef = firebase.storage().ref();
        const filename = Math.floor(Date.now() / 1000);
        const imageRef = storageRef.child(`images/${filename}.jpg`);
         var loading = this.loadingCtrl.create({
            content: `<div class="custom-spinner-container">
                        <div class="custom-spinner-box">Uploading image to firebase</div>
                     </div>`
          })

         loading.present();
        imageRef.putString(this.base64Image, 'data_url').then((snapshot)=> {
       
         // remove these when server is established
         // -----------------------------------
         loading.dismiss();
         alert("image uploaded to firebase");
         alert(this.text);
         this.text = "";
        this.base64Image = undefined;

         // -----------------------------------

         // send http to server
        // let body = new URLSearchParams();
        // body.set('title', this.text);
        // body.set('img_url', snapshot.downloadURL);
         
        //  //setting headers 
        //  let headers = new Headers();
        //  headers.append('content-type', 'application/x-www-form-urlencoded');
        //  let options = new RequestOptions({ headers: headers });
        //  this.http
        //     .post('YOUR URL', body.toString(), options)
        //     .subscribe(response => {
        //         //show alert depending on the response
                  
               
        //         // after successful save to db 
        //         // loading.dismiss();
        //         // this.text = "";
        //         // this.base64Image = undefined;



        //     });


        }, (err)=>{
            alert(err);
        });
        
      }else{
         alert("Please enter the text")
      }   
  
        

    }




}
