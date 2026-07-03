import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Review } from "../../../Interfaces/review.interface";

@Component({
    selector: 'app-review',
    standalone:true,
    imports:[
        FormsModule,
        CommonModule
    ],
    templateUrl: './Review.Component.html'
})
export class ReviewComponent{
    showModal = false;

    openModal() {
    this.showModal = true;
    }

    closeModal() {
    this.showModal = false;

    this.userName = '';
    this.grade = null;
    this.review = '';
    }

    userName='';
    grade:number|null=null;
    review='';

    //Arreglo temporal
    reviews:Review[]=[];

    publishReview(){

        this.reviews.unshift({
        userName:this.userName,
        grade:this.grade!,
        review:this.review
        });

        this.showModal=false;

        this.userName='';
        this.grade=null;
        this.review='';

    }
}