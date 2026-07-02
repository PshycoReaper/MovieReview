import { Component } from '@angular/core';
import { SideBarComponent } from "../../components/Dashboard/SideBar.Component/SideBar.Component";
import { PrincipalDashboard } from "../../components/Dashboard/principalDashboard/principalDashboard";

@Component({
  selector: 'adminDashboard',
  imports: [ SideBarComponent, PrincipalDashboard],
  templateUrl: './adminDashboard.html',
})
export class AdminDashboard {



}
