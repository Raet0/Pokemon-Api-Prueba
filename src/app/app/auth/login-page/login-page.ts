import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

const USER = {
  email: 'usuario@ups.edu.ec',
  password: '123456',
};

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {
  errorMessage = signal<string | null>(null);
  form: any; // Declaración de la propiedad `form`

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicialización de `form` dentro del constructor
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.errorMessage.set('Formulario inválido. Corrige los campos.');
      return;
    }

    const { email, password } = this.form.value;

    if (email === USER.email && password === USER.password) {
      this.router.navigate(['home']);
    } else {
      this.errorMessage.set('Credenciales incorrectas');
    }
  }
}