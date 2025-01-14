const todoList = document.getElementById('todo-list');
		const wbsInput = document.getElementById('wbs-input');
		const taskInput = document.getElementById('task-input');
		//const durationInput = document.getElementById('duration-input');
		const startInput = document.getElementById('start-input');
		const finishInput = document.getElementById('finish-input');
		const addTodoButton = document.getElementById('add-todo');

		let todos = [];
    let taskvisMap = new Map();

		function addTodo() {

      const startDate = new Date(startInput.value);
      const startWeekNumber = getWeekNumber(startDate);
      const dayNumber = getDayOfYear(startDate);
      const finishDate = new Date(finishInput.value);
      const durationInMilliseconds = finishDate - startDate;
      const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
      const durationInWeeks = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24 * 7));

      const todo = {
          wbs: wbsInput.value,
          taskName: taskInput.value,
          duration: durationInDays,
          start: startInput.value,
          finish: finishInput.value
      };
  
      todos.push(todo);
  
      // Add the taskduration row here
      const taskduration = document.querySelector('.taskduration');
      const taskdurationRow = document.createElement('div');
      taskdurationRow.style.height = '4.14rem';
      taskduration.appendChild(taskdurationRow);
  
      // Create the taskvis div and assign the event listeners for dragging
      const taskvis = document.createElement('div');
      taskvis.textContent = ``;
      taskvis.style.backgroundColor = 'blue';
      taskvis.style.height = '70%';
      taskvis.style.width = `${3.645 * durationInDays / 7}rem`; 
      taskvis.style.position = 'relative';
      taskvis.style.left = `${(dayNumber+7) * 3.645 / 7}rem`;
      taskvis.style.cursor = 'pointer';
      taskdurationRow.appendChild(taskvis);
  
      taskvis.addEventListener('mousedown', handleMouseDown);
      taskvis.addEventListener('mousemove', handleMouseMove);
      taskvis.addEventListener('mouseup', handleMouseUp); 
      
      taskvisMap.set(todos.length - 1, {
      taskvis: taskvis,
      taskdurationRow: taskdurationRow
      });


			renderTodos();
			resetInputs();

		}

    let isMouseDown = false;
    let offsetX;
    let currentDraggable;

    function handleMouseDown(event) {
      isMouseDown = true;
      offsetX = event.clientX - event.target.getBoundingClientRect().left;
      currentDraggable = event.target;
    }
  
    function handleMouseUp() {
      if (isMouseDown && currentDraggable) {
        const containerRect = currentDraggable.parentElement.getBoundingClientRect();
        const draggableRect = currentDraggable.getBoundingClientRect();
        const newDistancePx = draggableRect.left - containerRect.left;
        const newDistanceRem = pxToRem(newDistancePx);
    
        const distDays = newDistanceRem / (3.645 / 7);
    
        // Find the index of the task corresponding to the currentDraggable element
        const taskIndex = Array.from(currentDraggable.parentElement.children).indexOf(currentDraggable);
    
        // Update the start and finish dates for the task
        const task = todos[taskIndex];
        const newStartDate = new Date(task.start);
        const dayNumber = getDayOfYear(newStartDate);
        const dist = (dayNumber+7) * 3.645 / 7;
        newStartDate.setDate(newStartDate.getDate() - (dist - distDays));
    
        const newFinishDate = new Date(task.finish);
        newFinishDate.setDate(newFinishDate.getDate() - (dist - distDays));
    
        task.start = newStartDate.toISOString().split('T')[0];
        task.finish = newFinishDate.toISOString().split('T')[0];
    
        // Re-render the table with the updated task data
        renderTodos();
    
        isMouseDown = false;
        currentDraggable = null;
      }
    }
    

    function pxToRem(pixels) {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return pixels / rootFontSize;
    }

    function handleMouseMove(event) {
      if (isMouseDown && currentDraggable) {
          const containerRect = currentDraggable.parentElement.parentElement.getBoundingClientRect();
          let newX = event.clientX - offsetX;
  
          // Keep the div inside the container horizontally
          newX = Math.max(newX, containerRect.left);
          newX = Math.min(newX, containerRect.right - currentDraggable.clientWidth);
  
          currentDraggable.style.left = newX - containerRect.left + 'px';
      }
    }

		function renderTodos() {
			todoList.innerHTML = '';

			todos.forEach((todo, index) => {
				const row = document.createElement('tr');

				const wbsCell = document.createElement('td');
				wbsCell.innerText = todo.wbs;
				row.appendChild(wbsCell);

				const taskCell = document.createElement('td');
				taskCell.innerText = todo.taskName;
				row.appendChild(taskCell);

				const startCell = document.createElement('td');
				startCell.innerText = todo.start;
				row.appendChild(startCell);

				const finishCell = document.createElement('td');
				finishCell.innerText = todo.finish;
				row.appendChild(finishCell);

        const durationCell = document.createElement('td');
				durationCell.innerText = todo.duration;
				row.appendChild(durationCell);

				const actionCell = document.createElement('td');

				const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
          const elementsToRemove = taskvisMap.get(index);
          if (elementsToRemove) {
            elementsToRemove.taskvis.remove();
            elementsToRemove.taskdurationRow.remove();
            taskvisMap.delete(index);
          }

          // Update the todos array and re-render
          todos.splice(index, 1);
          renderTodos();
        });
        actionCell.appendChild(deleteButton);

				row.appendChild(actionCell);

				todoList.appendChild(row);
			});
		}

		function resetInputs() {
			wbsInput.value = '';
			taskInput.value = '';
			durationInput.value = '';
			startInput.value = '';
			finishInput.value = '';
		}

		addTodoButton.addEventListener('click', addTodo);


    const weeksDiv = document.querySelector('.weeks');

for (let i = 1; i <= 52; i++) {
   
    const weekDiv = document.createElement('div');
    
    weekDiv.id = `w${i}`;

    weekDiv.setAttribute('name', `w${i}`);
    
    weekDiv.textContent = `w${i}`;

    weeksDiv.appendChild(weekDiv);
}

const monthsDiv = document.querySelector('.months');

// Array of month names
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

monthNames.forEach((month, index) => {

    const monthDiv = document.createElement('div');
    
    monthDiv.id = `month${index + 1}`;
    monthDiv.setAttribute('name', month);
    
    monthDiv.textContent = month;

    monthsDiv.appendChild(monthDiv);
});

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
  const weekNumber = Math.ceil((dayOffset + firstDayOfYear.getDay() + 1) / 7);
  return weekNumber;
}

function getDayOfYear(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
  const dayNumber = Math.floor(dayOffset) + 1;
  return dayNumber;
}

const date = new Date();
