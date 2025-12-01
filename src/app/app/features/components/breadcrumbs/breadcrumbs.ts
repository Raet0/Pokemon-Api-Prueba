import { Component, input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  templateUrl: './breadcrumbs.html',
})
export class Breadcrumbs {
  items = input<{ label: string; link?: string }[]>([]);
}