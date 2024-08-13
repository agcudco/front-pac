import { useEffect, useRef, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

interface Author {
    id: number;
    name: string;
    lastName: string;
    dni: string;
    dateBirth: Date;
    country: string;
}


export const AuthorTable: React.FC = () => {

    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useRef<Toast>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorDialog, setAuthorDialog] = useState<boolean>(true);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [submited, setSumited] = useState<boolean>(false);

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await fetch('http://localhost:8080/author/');
            if (!response.ok) {
                throw new Error('Error fetching auhtors');
            }
            const data: Author[] = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error('Error fetching authors:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error fetching authors', life: 3150 });
        } finally {
            setLoading(false);
        }
    };

    const createAuthor = async (author: Author) => {
        try {
            const response = await fetch('http://localhost:8080/author/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(author)
            });
            if (!response.ok) throw new Error('Error creating auhtors');
        } catch (error) {
            console.error('Error creating authors:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error creating authors', life: 3150 });
        }
    }

    const updateAuthor = async (author: Author) => {
        try {
            //const response = await fetch('http://localhost:8080/author/');
            //const response = await fetch(`http://localhost:8080/author/${author.id}`, {
            const response = await fetch('http://localhost:8080/author/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(author)
            });
            if (!response.ok) throw new Error('Error updating auhtors');
        } catch (error) {
            console.error('Error updating authors:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error updating authors', life: 3150 });
        }
    }

    const deleteAuthor = async () => {
        if (author) {
            try {
                const response = await fetch(`http://localhost:8080/author/${author.id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Error deleting auhtors');
                setAuthors(authors.filter(val => val.id !== author.id));                
                setDeleteDialog(false);
                setAuthor(null);
                toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Autor eliminado exitosamente', life: 3000 });
            } catch (error) {
                console.error('Error deleting authors:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error deleting authors', life: 3150 });
            }
        }
    }

    const openNew = () => {
        setAuthor({ id: 0, name: '', lastName: '', dni: '', dateBirth: new Date(), country: '' });
        setSumited(false);
        setAuthorDialog(true);
    }

    const header = (
        <div>
            <h3>Gestión de Autores</h3>
            <Button label="Nuevo"
                icon="pi pi-plus"
                className="p-button-success"
                onClick={openNew}
            />
        </div>
    );

    const hideDialog = () => {
        setAuthor({ id: 0, name: '', lastName: '', dni: '', dateBirth: new Date(), country: '' });
        setSumited(false);
        setAuthorDialog(false);
        setDeleteDialog(false);
    }

    const saveAuthor = async () => {
        setSumited(true);
        if (author && author.name.trim()) {
            if (author.id) {
                await updateAuthor(author);
                toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Autor actualizado', life: 3000 });
            } else {
                await createAuthor(author);
                toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Autor Registrado', life: 3000 });
            }

            setAuthorDialog(false);
            setAuthor(null);
            fetchAuthors();
        }
    }

    const authorDialogFooter = (
        <>
            <Button label="Guardar" icon="pi pi-check" onClick={saveAuthor} />
            <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} />
        </>
    );

    const authorDialogEliminarFooter = (
        <>
            <Button label="Si" icon="pi pi-check" onClick={deleteAuthor} />
            <Button label="No" icon="pi pi-times" onClick={hideDialog} />
        </>
    );

    const editAuthor = (author: Author) => {
        setAuthor({ ...author, dateBirth: new Date(author.dateBirth) });
        setAuthorDialog(true);
    }

    const confirmarEliminar = (author: Author) => {
        setAuthor(author);
        setDeleteDialog(true);
    }


    return (
        <div>
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" center={header}> </Toolbar>
            <DataTable value={authors} loading={loading}
                dataKey="id"
            >
                <Column field="id" header="ID" />
                <Column field="name" header="Nombre" />
                <Column field="lastName" header="Apellido" />
                <Column field="dni" header="DNI" />
                <Column field="country" header="country" />
                <Column body={(rowData) => (
                    <div>
                        <Button icon='pi pi-pencil'
                            onClick={() => editAuthor(rowData)} />
                        <Button icon='pi pi-trash'
                            onClick={() => confirmarEliminar(rowData)} />
                    </div>
                )}>
                </Column>
            </DataTable>

            <Dialog visible={authorDialog}
                header="Nuevo"
                modal
                className="p-fluid"
                onHide={hideDialog}
                footer={authorDialogFooter}
            >
                <div className="p-field">
                    <label htmlFor="txtDni">DNI:</label>
                    <InputText
                        id="txtDni"
                        value={author?.dni}
                        onChange={(e) => setAuthor({ ...author!, dni: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="txtName">Nombre:</label>
                    <InputText
                        id="txtName"
                        value={author?.name}
                        onChange={(e) => setAuthor({ ...author!, name: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="txtLastName">Apellido:</label>
                    <InputText
                        id="txtLastName"
                        value={author?.lastName}
                        onChange={(e) => setAuthor({ ...author!, lastName: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="txtDateBirth">Fecha de nacimiento:</label>
                    <Calendar
                        id="txtDateBirth"
                        value={author?.dateBirth}
                        onChange={(e) => setAuthor({ ...author!, dateBirth: e.value as Date })}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="txtCountry">País:</label>
                    <InputText
                        id="txtCountry"
                        value={author?.country}
                        onChange={(e) => setAuthor({ ...author!, country: e.target.value })}
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteDialog}
                header="Eliminar"
                modal
                className="p-fluid"
                onHide={hideDialog}
                footer={authorDialogEliminarFooter}
            >
                <div>
                    <span>Está seguro de eliminar el autor <b>{author?.name} {author?.lastName}</b>?</span>
                </div>
            </Dialog>

        </div >
    );
}


