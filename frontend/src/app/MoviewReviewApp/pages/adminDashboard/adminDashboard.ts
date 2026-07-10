import { Component } from '@angular/core';
import { SideBarComponent } from "../../components/Dashboard/SideBar.Component/SideBar.Component";
import { RouterOutlet } from "@angular/router";



@Component({
  selector: 'adminDashboard',
  imports: [SideBarComponent, RouterOutlet],
  templateUrl: './adminDashboard.html',
})
export class AdminDashboard {



}
