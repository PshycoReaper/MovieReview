import { Component } from '@angular/core';
import { SideBarComponent } from "../../components/Dashboard/SideBar.Component/SideBar.Component";
import { PrincipalDashboard } from "./principalDashboard/principalDashboard";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'adminDashboard',
  imports: [SideBarComponent, PrincipalDashboard, RouterOutlet],
  templateUrl: './adminDashboard.html',
})
export class AdminDashboard {



}
