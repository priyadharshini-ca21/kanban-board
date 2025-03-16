import React, { memo, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import styled from "styled-components";

const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ColumnContainer = styled.div`
    width: 225px; 
    min-height: 600px;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
    font-weight: bold;
    font-size: 16px;
    text-align: left;
    margin-bottom: 5px;
    width: 100%;
    padding: 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1px;
    position: relative;
`;

const IconButton = styled.button`
    background-color: transparent;
    color: gray;
    border: none;
    cursor: pointer;
    font-size: 18px;
    transition: color 0.3s;
    padding: 5px;
    margin: 0;

    &:hover {
        color: silver;
    }

    &:focus {
        outline: none;
    }
`;

const DotsButton = styled(IconButton)`
    line-height: 1; 
    transform: translateY(-4px); 
`;

//DeleteSection Button
const DeleteButton = styled.button`
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    margin-top: 2px;

    &:hover {
        background-color: darkred;
    }
`;

const AddTaskButton = styled.button`
    margin: 5px 0;
    padding: 5px;
    background-color: transparent;
    color: gray;
    border: none;
    cursor: pointer;
    outline: none; 
    
    &:hover {
        color: silver; 
    }

    &:focus {
        outline: none; 
    }
`;


const Column = memo(({ columnId, column, addTask, deleteTask, deleteSection }) => {
   
    const [showDelete, setShowDelete] = useState(false);

    const toggleDelete = () => {
    setShowDelete((prev) => !prev);
    };


    const handleDeleteAll = () => {
        column.tasks.forEach((task) => deleteTask(columnId, task.id)); // Delete all tasks first
        deleteSection(columnId); // Then delete the section
        setShowDelete(false); // Hide the delete button after deletion
    };
    
   
   
    return (
        <ColumnWrapper>
            <Title>
                {column.name}
                <ButtonGroup>
                    <IconButton onClick={addTask}>+</IconButton>
                    <DotsButton onClick={toggleDelete}>...</DotsButton>
                    
                    {showDelete && (
                    <DeleteButton onClick={handleDeleteAll}>Delete</DeleteButton>
                    )}


                    </ButtonGroup>
            </Title>
        <Droppable droppableId={columnId}>
            {(provided) => (
                <ColumnContainer {...provided.droppableProps} ref={provided.innerRef}>
                    {column.tasks.map((task, index) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            columnId={columnId}
                            deleteTask={deleteTask}  // Pass deleteTask to TaskCard
                        />
                        
                    ))}
                    {provided.placeholder}
                    <AddTaskButton onClick={addTask}>+ Add task</AddTaskButton>
                </ColumnContainer>
            )}
        </Droppable>
        </ColumnWrapper>
    );
});

export default Column;
