import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';


const routes: Routes = [
  { path: 'gallery', component: ItemListComponent },
  { path: 'gallery/:path', component: ItemListComponent },
  { path: '', redirectTo: '/gallery', pathMatch: 'full' },
  { path: '**', component: ItemListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
