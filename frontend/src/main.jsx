///////////////////////
//This is the entry point of the application
//renders the App component inside a BrowserRouter
//Wraps the App component in StrictMode and BrowserRouter for routing
//Renders the application into the DOM
//////////////////////

import { StrictMode } from 'react' //enables React's Strict Mode to catch potential issues in the app
import { createRoot } from 'react-dom/client' //react 18 method for creating a root and rendering
import './index.css' //imports global CSS styles
import App from './App.jsx' //main App component
import { BrowserRouter } from 'react-router-dom' //enables client-side routing
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' //react query setup for handling API requests efficiently

//create a QueryClient instance with default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false //prevents refetching data when switching back to the tab
    }
  }
})

//find the root element in the HTML and render the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}> {/* Provides React Query context to the application */}
      <App />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
