// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ** Axios Imports
import axios from 'axios';

// ** Fetch Boards
export const fetchBoards = createAsyncThunk('appKanban/fetchBoards', async () => {
  return [
    {
      id: 'todo',
      title: 'TODO',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
    },
    {
      id: 'done',
      title: 'Done',
    },
  ];
});

export const fetchTasks = createAsyncThunk('appKanban/fetchTasks', async () => {
  return [
    {
      id: 1,
      labels: ['UX'],
      boardId: 'todo',
      description: 'lorem',
      dueDate: dayAfterTomorrow,
      title: 'Research FAQ page UX',
      attachments: [
        {
          name: 'documentation.doc',
        },
        {
          name: 'app.js',
          // img: require('@src/assets/images/icons/file-icons/js.png').default
        },
      ],
      comments: [
        {
          name: 'Joey Tribbiani',
          // img: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Chandler Bing',
          // img: require('@src/assets/images/portrait/small/avatar-s-5.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Monica Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
          comment: 'Complete this on priority',
        },
      ],
      assignedTo: [
        {
          title: 'Ross Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-1.jpg').default
        },
        {
          title: 'Pheobe Buffay',
          // img: require('@src/assets/images/portrait/small/avatar-s-2.jpg').default
        },
      ],
    },
    {
      id: 2,
      labels: ['Images'],
      boardId: 'todo',
      // coverImage: require('@src/assets/images/slider/03.jpg').default,
      description: 'lorem',
      dueDate: dayAfterTomorrow,
      title: 'Find new images for the apps',
      comments: [],
      attachments: [
        {
          name: 'book.pdf',
          // img: require('@src/assets/images/icons/file-icons/pdf.png').default
        },
        {
          name: 'app.js',
          // img: require('@src/assets/images/icons/file-icons/js.png').default
        },
      ],
      assignedTo: [
        {
          title: 'Rachel Green',
          // img: require('@src/assets/images/portrait/small/avatar-s-4.jpg').default
        },
      ],
    },
    {
      id: 3,
      labels: ['App'],
      attachments: [
        {
          name: 'list.txt',
          // img: require('@src/assets/images/icons/file-icons/txt.png').default
        },
        {
          name: 'pdf.png',
          // img: require('@src/assets/images/icons/file-icons/pdf.png').default
        },
      ],
      boardId: 'in-progress',
      description: '',
      dueDate: dayAfterTomorrow,
      title: 'Review completed Apps',
      comments: [
        {
          name: 'Chandler Bing',
          // img: require('@src/assets/images/portrait/small/avatar-s-5.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Monica Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Joey Tribbiani',
          // img: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Rachel Green',
          // img: require('@src/assets/images/portrait/small/avatar-s-4.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Ross Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-1.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Pheobe Buffay',
          // img: require('@src/assets/images/portrait/small/avatar-s-2.jpg').default,
          comment: 'Complete this on priority',
        },
      ],
      assignedTo: [
        {
          title: 'Monica Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default
        },
        {
          title: 'Chandler Bing',
          // img: require('@src/assets/images/portrait/small/avatar-s-4.jpg').default
        },
      ],
    },
    {
      id: 4,
      labels: ['Code Review'],
      attachments: [
        {
          name: 'list.txt',
          // img: require('@src/assets/images/icons/file-icons/txt.png').default
        },
        {
          name: 'pdf.png',
          // img: require('@src/assets/images/icons/file-icons/pdf.png').default
        },
        {
          name: 'documentation.doc',
          // img: require('@src/assets/images/icons/file-icons/doc.png').default
        },
        {
          name: 'app.js',
          // img: require('@src/assets/images/icons/file-icons/js.png').default
        },
      ],
      boardId: 'in-progress',
      description: '',
      dueDate: dayAfterTomorrow,
      title: 'Review Javascript Code',
      comments: [
        {
          name: 'Chandler Bing',
          // img: require('@src/assets/images/portrait/small/avatar-s-5.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Monica Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
          comment: 'Complete this on priority',
        },
      ],
      assignedTo: [
        {
          title: 'Joey Tribbiani',
          // img: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default
        },
        {
          title: 'Jerry Seinfeld',
          // img: require('@src/assets/images/portrait/small/avatar-s-4.jpg').default
        },
      ],
    },
    {
      id: 5,
      labels: ['Forms'],
      attachments: [
        {
          name: 'list.txt',
          // img: require('@src/assets/images/icons/file-icons/txt.png').default
        },
      ],
      boardId: 'done',
      description: '',
      dueDate: dayAfterTomorrow,
      title: 'Forms & Tables Section',
      comments: [
        {
          name: 'Chandler Bing',
          // img: require('@src/assets/images/portrait/small/avatar-s-5.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Monica Geller',
          // img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
          comment: 'Complete this on priority',
        },
      ],
      assignedTo: [
        {
          title: 'Astro Kramer',
          // img: require('@src/assets/images/portrait/small/avatar-s-1.jpg').default
        },
        {
          title: 'George Costanza',
          // img: require('@src/assets/images/portrait/small/avatar-s-2.jpg').default
        },
      ],
    },
    {
      id: 6,
      labels: ['Charts & Maps'],
      attachments: [
        {
          name: 'documentation.doc',
          // img: require('@src/assets/images/icons/file-icons/doc.png').default
        },
        {
          name: 'app.js',
          // img: require('@src/assets/images/icons/file-icons/js.png').default
        },
        {
          name: 'book.pdf',
          // img: require('@src/assets/images/icons/file-icons/pdf.png').default
        },
      ],
      boardId: 'done',
      description: '',
      dueDate: dayAfterTomorrow,
      title: 'Completed Charts & Maps',
      comments: [
        {
          name: 'Elaine Benes',
          // img: require('@src/assets/images/portrait/small/avatar-s-5.jpg').default,
          comment: 'Complete this on priority',
        },
        {
          name: 'Newman Knight',
          // img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
          comment: 'Complete this on priority',
        },
      ],
      assignedTo: [
        {
          title: 'Charlie Kelly',
          // img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default
        },
        {
          title: 'Dennis Reynolds',
          // img: require('@src/assets/images/portrait/small/avatar-s-4.jpg').default
        },
      ],
    },
  ];
});

export const updateTask = createAsyncThunk('appKanban/updateTask', async (data, { dispatch }) => {
  const response = await axios.post('/apps/kanban/update-task', { data });
  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response.data;
});

export const addBoard = createAsyncThunk('appKanban/addBoard', async (data, { dispatch }) => {
  const response = await axios.post('/apps/kanban/add-board', { data });
  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response.data;
});

export const addTask = createAsyncThunk('appKanban/addTask', async (data, { dispatch }) => {
  const response = await axios.post('/apps/kanban/add-task', { data });
  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response.data;
});

export const clearTasks = createAsyncThunk('appKanban/clearTasks', async (id, { dispatch }) => {
  const response = await axios.delete('/apps/kanban/clear-tasks', { data: id });

  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response;
});

export const updateTaskBoard = createAsyncThunk('appKanban/updateTaskBoard', async (data, { dispatch }) => {
  const response = await axios.post('/apps/kanban/update-task-board', { data });
  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response.data;
});

export const reorderTasks = createAsyncThunk('appKanban/reorder-tasks', async (data, { dispatch }) => {
  const response = await axios.post('/apps/kanban/reorder-tasks', { data });
  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response.data;
});

export const deleteBoard = createAsyncThunk('appKanban/deleteBoard', async (id, { dispatch }) => {
  const response = await axios.delete('/apps/kanban/delete-board', { data: id });

  await dispatch(fetchBoards());
  await dispatch(fetchTasks());

  return response;
});

export const appKanbanSlice = createSlice({
  name: 'appKanban',
  initialState: {
    tasks: [],
    boards: [],
    selectedTask: null,
  },
  reducers: {
    handleSelectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  },
});

export const { handleSelectTask } = appKanbanSlice.actions;

export default appKanbanSlice.reducer;
