import './List.scss';
import React from 'react';
import {ChangeEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from 'axios';

// PascalCase - des composants React + Typescript, dossiers/stylesheets
// camelCase - pour le reste
// kebab-case pour des classes CSS

interface Item {
    id: number;
    value: string;
    status: boolean,
}

function ListItem() {

    // Use Hook useState()
    const [currentToDo, setCurrentToDo] = useState('');
    const [toDos, setToDos] = useState<Item[]>([]);

    //Use Hook Effect and axios to get API
    useEffect(() => {
        axios.get<Item[]>('http://localhost:1337/todo-lists').then((res: AxiosResponse) => {
            setToDos(res.data);
        });
    }, []);

    //Use getTime() to get ID unique
    const timeToDo = () => {
        const date: Date = new Date();
        return date.getTime();
    }

    //Add a new list
    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentToDo === "") {
            alert(JSON.stringify("Please write something!"));
        } else {
            //Submit into Array
            setCurrentToDo("");
            setToDos([
                ...toDos,
                {
                    id: timeToDo(), //temporary
                    value: currentToDo,
                    status: false,
                }
            ])

            //POST to API
            axios.post('http://localhost:1337/todo-lists', {
                value: currentToDo,
                status: false,
            }).then(res => console.log(res))
                .catch((err => console.error(err)));
        }
    };

    //use filter to create a new array without array[id]
    const deleteToDo = (id: number) => {
        //Delete in Array
        const filterToDo: Array<Item> = toDos.filter(
            (toDo: Item) => toDo.id !== id);
        setToDos(filterToDo);

        //Delete in API
        axios.delete('http://localhost:1337/todo-lists/'+id)
            .then(res => console.log(res))
            .catch((err => console.error(err)));
    }

    // true - DONE , false - Not Done
    const updateToDo = (toDo: Item, e: ChangeEvent<HTMLInputElement>) => {
        //update in Array
        toDo.status = e.target.checked;

        //Update in API
        axios.put('http://localhost:1337/todo-lists/'+toDo.id, {
            value: toDo.value,
            status: toDo.status,
        }).then(res => console.log(res))
            .catch((err => console.error(err)));
    }

    //Show the List
    const renderToDos = () => {
        return toDos.map((toDo: Item) => {
            return (
                <div key={toDo.id} className="list-bigger">
                    <input
                           type="checkbox"
                           defaultChecked={toDo.status}
                           onChange={(e) => updateToDo(toDo, e)}
                    />
                    <span>  {toDo.value} &nbsp;&nbsp;</span>
                    <button onClick={() => deleteToDo(toDo.id)}> Delete </button>
                    <br></br> <br></br>
                </div>
            )
        })
    }

    return (
        <div>
            <form onSubmit={(e) => HandleSubmit(e)}>
                <input className="form-bigger"
                       placeholder=" What you need to do ?"
                       type="text"
                       value={currentToDo}
                       onChange={e => setCurrentToDo(e.target.value)}
                />
                <br></br> <br></br>
                <button className="btn-bigger" type="submit">Todo</button>
            </form>
            <br></br>
            <section>{renderToDos()} </section>
        </div>
    );
}
export default ListItem;

