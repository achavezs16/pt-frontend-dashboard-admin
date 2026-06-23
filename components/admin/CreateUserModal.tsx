'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { apiClient } from '@/lib/api';

type Role = 'PYME' | 'REPARTIDOR';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onCreated: () => Promise<void>;
}

export default function CreateUserModal({ isOpen, onClose, role, onCreated }: Props) {
  const [form, setForm] = useState({
    nombrePyme: '',
    rutPyme: '',
    emailContactoPyme: '',
    telefonoContactoPyme: '',
    direccionSucursalPyme: '',
    comunaSucursalPyme: '',
    regionSucursalPyme: '',

    nombreRepresentante: '',
    apellidoRepresentante: '',
    emailRepresentante: '',

    nombre: '',
    apellido: '',
    email: '',

    password: '12345678',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const title = role === 'PYME' ? 'Registrar nueva PYME' : 'Registrar nuevo repartidor';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      nombrePyme: '',
      rutPyme: '',
      emailContactoPyme: '',
      telefonoContactoPyme: '',
      direccionSucursalPyme: '',
      comunaSucursalPyme: '',
      regionSucursalPyme: '',

      nombreRepresentante: '',
      apellidoRepresentante: '',
      emailRepresentante: '',

      nombre: '',
      apellido: '',
      email: '',

      password: '12345678',
    });
  };

  const validarPyme = () => {
    if (
      !form.nombrePyme ||
      !form.rutPyme ||
      !form.emailContactoPyme ||
      !form.nombreRepresentante ||
      !form.apellidoRepresentante ||
      !form.emailRepresentante ||
      !form.password
    ) {
      setError('Completa los datos obligatorios de la empresa y del representante.');
      return false;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    return true;
  };

  const validarRepartidor = () => {
    if (!form.nombre || !form.apellido || !form.email || !form.password) {
      setError('Completa todos los campos obligatorios.');
      return false;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    return true;
  };

  const crearPyme = async () => {
    await apiClient.post('/admin/pymes', {
      nombrePyme: form.nombrePyme,
      rutPyme: form.rutPyme,
      emailContactoPyme: form.emailContactoPyme,
      telefonoContactoPyme: form.telefonoContactoPyme,
      direccionSucursalPyme: form.direccionSucursalPyme,
      comunaSucursalPyme: form.comunaSucursalPyme,
      regionSucursalPyme: form.regionSucursalPyme,
      nombreRepresentante: form.nombreRepresentante,
      apellidoRepresentante: form.apellidoRepresentante,
      emailRepresentante: form.emailRepresentante,
      password: form.password,
    });
  };

  const crearRepartidor = async () => {
    await apiClient.post('/auth/register', {
      email: form.email,
      password: form.password,
      nombre: form.nombre,
      apellido: form.apellido,
      rol: 'REPARTIDOR',
      pymeId: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const valido = role === 'PYME' ? validarPyme() : validarRepartidor();

    if (!valido) return;

    try {
      setLoading(true);

      if (role === 'PYME') {
        await crearPyme();
      } else {
        await crearRepartidor();
      }

      await onCreated();
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('Error creando usuario:', err);
      setError(err?.message || 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {role === 'PYME' ? (
          <>
            <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
              <div>
                <h3 className="font-black text-gray-900">Datos de la empresa</h3>
                <p className="text-xs text-gray-500">
                  Información comercial y de contacto de la PYME.
                </p>
              </div>

              <Input
                label="Nombre de la PYME *"
                name="nombrePyme"
                value={form.nombrePyme}
                onChange={handleChange}
                fullWidth
              />

              <Input
                label="RUT PYME *"
                name="rutPyme"
                value={form.rutPyme}
                onChange={handleChange}
                placeholder="77.777.777-7"
                fullWidth
              />

              <Input
                label="Email contacto PYME *"
                name="emailContactoPyme"
                type="email"
                value={form.emailContactoPyme}
                onChange={handleChange}
                fullWidth
              />

              <Input
                label="Teléfono contacto"
                name="telefonoContactoPyme"
                value={form.telefonoContactoPyme}
                onChange={handleChange}
                fullWidth
              />

              <Input
                label="Dirección sucursal"
                name="direccionSucursalPyme"
                value={form.direccionSucursalPyme}
                onChange={handleChange}
                fullWidth
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Comuna"
                  name="comunaSucursalPyme"
                  value={form.comunaSucursalPyme}
                  onChange={handleChange}
                  fullWidth
                />

                <Input
                  label="Región"
                  name="regionSucursalPyme"
                  value={form.regionSucursalPyme}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 space-y-4">
              <div>
                <h3 className="font-black text-gray-900">Representante / acceso</h3>
                <p className="text-xs text-gray-500">
                  Este usuario podrá ingresar al portal PYME.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Nombre representante *"
                  name="nombreRepresentante"
                  value={form.nombreRepresentante}
                  onChange={handleChange}
                  fullWidth
                />

                <Input
                  label="Apellido representante *"
                  name="apellidoRepresentante"
                  value={form.apellidoRepresentante}
                  onChange={handleChange}
                  fullWidth
                />
              </div>

              <Input
                label="Email de acceso *"
                name="emailRepresentante"
                type="email"
                value={form.emailRepresentante}
                onChange={handleChange}
                helperText="Con este correo la PYME iniciará sesión."
                fullWidth
              />

              <Input
                label="Contraseña inicial *"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                helperText="Mínimo 8 caracteres. Para demo se puede usar 12345678."
                fullWidth
              />
            </section>
          </>
        ) : (
          <>
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="Contraseña inicial"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              helperText="Mínimo 8 caracteres. Para demo se puede usar 12345678."
              fullWidth
            />
          </>
        )}

        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button type="submit" loading={loading}>
            {role === 'PYME' ? 'Crear PYME' : 'Crear repartidor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}