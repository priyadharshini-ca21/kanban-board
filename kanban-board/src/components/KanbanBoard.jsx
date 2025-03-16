import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";


const Container = styled.div`
    display: flex;
    gap: 20px;
    padding: 20px;
`;

const Button = styled.button`
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Modal = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
`;

const Input = styled.input`
    margin: 5px 0;
    padding: 5px;
    height: 25px;
    width: 97%;
    background-color: lightgray;
    color: gray;
    border: none;
    border-radius: 5px;
    outline: none;

    &::placeholder {
        color: gray;
        opacity: 0.8;
    }
    
`;

const Select = styled.select`
    margin: 5px 0;
    padding: 4px;
    background-color: lightgray;
    border-radius: 5px;
    color: gray;
    height: 35px;
    width: 100%;
`;

const AddButton = styled.button`
    margin: 5px 10px 5px 0;
    padding: 5px;
    background-color: green;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #f0f0f0;
        color: black;
    }
`;

const AddSectionButton = styled(Button)`
    position: relative;
    bottom: 315px;
    margin-left: 10px;
    align-self: center;
`;

const Heading = styled.h3`
    color: black;
    margin-bottom: 10px;
`;

const CancelButton = styled(AddButton)`
    background-color: green;
    color: white;

    &:hover {
        background-color: #f0f0f0;
        color: black;
    }
`;

const initialColumns = {
    todo: {
        name: "To Do",
        tasks: [],
    },
    inProgress: {
        name: "In Progress",
        tasks: [],
    },
    Done: {
        name: "Done",
        tasks: [],
    },
    
    
};

const KanbanBoard = () => {
    const [columns, setColumns] = useState(initialColumns);
    const [showModal, setShowModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [currentColumnId, setCurrentColumnId] = useState("");
    const [taskName, setTaskName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("Assigned");

    // Open Task Modal
    const openModal = (columnId) => {
        setCurrentColumnId(columnId);
        setShowModal(true);
    };

    // Close Task Modal
    const closeModal = () => {
        setShowModal(false);
        setTaskName("");
        setDueDate("");
        setStatus("Assigned");
    };

    // Open & Close Section Modal
    const openSectionModal = () => setShowSectionModal(true);
    const closeSectionModal = () => {
        setShowSectionModal(false);
        setSectionName("");
    };

    // Add New Section
    const addSection = () => {
        if (!sectionName.trim()) return;
        const newColumnId = uuidv4();
        setColumns({
            ...columns,
            [newColumnId]: { name: sectionName, tasks: [] },
        });
        closeSectionModal();
    };

    // Add Task
    const addTask = () => {
        if (!taskName.trim() || !dueDate.trim()) return;
        const newTask = {
            id: uuidv4(),
            name: taskName,
            description: `Due: ${dueDate}, Status: ${status}`,
            dueDate,
            status,
        };
        setColumns((prevColumns) => ({
            ...prevColumns,
            [currentColumnId]: {
                ...prevColumns[currentColumnId],
                tasks: [...prevColumns[currentColumnId].tasks, newTask],
            },
        }));
        closeModal();
    };

    // Delete Task
    const deleteTask = (columnId, taskId) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [columnId]: {
                ...prevColumns[columnId],
                tasks: prevColumns[columnId].tasks.filter((task) => task.id !== taskId),
            },
        }));
    };

    const deleteSection = (columnId) => {
        setColumns((prevColumns) => {
            const updatedColumns = { ...prevColumns };
            delete updatedColumns[columnId];
            return updatedColumns;
        });
    };

    // Handle Drag and Drop
const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    // Clone tasks to avoid direct mutation
    const sourceTasks = Array.from(sourceColumn.tasks);
    const destinationTasks = Array.from(destinationColumn.tasks);

    // Remove the dragged task from the source column
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // Check if the task already exists in the destination column to prevent duplication
    if (destinationTasks.some(task => task.id === movedTask.id)) return;

    // Insert the dragged task into the new column
    destinationTasks.splice(destination.index, 0, movedTask);

    setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
        [destination.droppableId]: { ...destinationColumn, tasks: destinationTasks },
    }));
};


    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Container>
                    {Object.entries(columns).map(([id, column]) => (
                        <Droppable droppableId={id} key={id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <Column
                                        columnId={id}
                                        column={column}
                                        addTask={() => openModal(id)}
                                        deleteTask={deleteTask}
                                        deleteSection={deleteSection}
                                    />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                    <AddSectionButton onClick={openSectionModal}>+ Add section</AddSectionButton>
                </Container>
            </DragDropContext>

            {showSectionModal && (
                <ModalOverlay>
                    <Modal>
                        <Heading>Add New Section</Heading>
                        <Input
                            placeholder="Section Name"
                            value={sectionName}
                            onChange={(e) => setSectionName(e.target.value)}
                        />
                        <AddButton onClick={addSection}>Add Section</AddButton>
                        <CancelButton onClick={closeSectionModal}>Cancel</CancelButton>
                   
                    </Modal>
                </ModalOverlay>
            )}

            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <Heading>Add New Task</Heading>
                        <Input
                            placeholder="Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option>Assigned</option>
                            <option>Programming</option>
                            <option>Design</option>
                            <option>Review</option>
                            <option>Completed</option>
                        </Select>
                        <AddButton onClick={addTask}>Submit</AddButton>
                        <CancelButton onClick={closeModal}>Cancel</CancelButton>
                    </Modal>
                </ModalOverlay>
            )}
        </>
    );
};

export default KanbanBoard;
