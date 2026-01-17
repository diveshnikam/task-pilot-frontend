import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "./components/Sidebar";
import ProjectsHome from "./components/ProjectsHome";
import TasksHome from "./components/TasksHome";


function App() {
  return (
    <>

    
    
    <div className="container-fluid bg-light">
      <div className="row">
      
        <div className="col-12 col-md-3 col-lg-3 p-0 sidebar-col">
          <Sidebar />
        </div>

       
        <div className="col-12 col-md-9 col-lg-9 p-0 main-col">
          <ProjectsHome />
        
          <TasksHome />
        </div>
      </div>

     
    </div>
    </>
  );
}

export default App;
