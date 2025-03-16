import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const Card = styled.div`
    padding: 12px;
    margin: 8px 0;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: black;
`;

const TaskHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
`;

const TaskName = styled.h4`
    margin: 0;
    font-weight: normal;
    color: black;
`;

const TaskDetails = styled.div`
    display: flex;
    align-items: Center;
    justify-content: space-between;
    margin-top: 4px;
`;

const ProfileIcon = styled(FaUserCircle)`
    font-size: 22px;
    color: gray;
    margin-right: 5px;
`;


const DueDate = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: ${({ color }) => color};
    
`;

const Description = styled.div`
margin-left: auto;
font-size: 14px;
font-weight: normal;
color: gray;
background-color: #f0f0f0;
border-radius: 9999px; /* Fully rounded corners */
padding: 1px 6px;    
text-align: center;

`;


const ToggleButton = styled.button`
    margin-left: auto;
    padding: 3px;
    background-color: transparent;
    color: gray;
    border: none;
    cursor: pointer;

    &:hover {
        color: silver;
    }

    &:focus {
        outline: none;
    }
`;

const DeleteButton = styled.button`
    margin-top: 4px;
    padding: 5px;
    background-color: transparent;
    color: gray;
    border: none;
    cursor: pointer;

    &:hover {
        color: red;
    }

    &:focus {
        outline: none;
    }
`;


// Format date as "DD MMM YY" (e.g., "12 Feb 25")
const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('en-GB', { month: 'short' });
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${day} ${month} ${year}`;
};
// Determine the color and label for the due date based on the date
const getColorAndLabelForDate = (dueDate) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    if (dueDate === yesterday) return { color: "red", label: "Yesterday" };
    if (dueDate === today) return { color: "black", label: "Today" };
    if (dueDate === tomorrow) return { color: "blue", label: "Tomorrow" };
    return { color: "gray", label: formatDate(dueDate) }; // Other dates formatted
};

const TaskCard = ({ task, index, columnId, deleteTask }) => {
    const [showDelete, setShowDelete] = useState(false);

    const toggleDelete = () => {
        setShowDelete((prev) => !prev);
    };

    // Get the color and label for the due date
    const { color, label } = getColorAndLabelForDate(task.dueDate);


    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                  <TaskHeader>
                        <TaskName>{task.name}</TaskName>
                        <ToggleButton onClick={toggleDelete} aria-label="Toggle delete options">...</ToggleButton>
                    </TaskHeader>
                    <TaskDetails>
                        <ProfileIcon />
                        <DueDate color={color}>{label}</DueDate>
                        <Description>{task.status}</Description>
                    </TaskDetails>


                    {showDelete && (
                        <DeleteButton onClick={() => deleteTask(columnId, task.id)} aria-label="Delete task">Delete</DeleteButton>
                    )}
                    </Card>
            )}
        </Draggable>
    );
};

export default TaskCard;
