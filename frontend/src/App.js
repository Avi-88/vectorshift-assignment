import { PipelineToolbar } from './components/toolbar';
import { PipelineUI } from './ui';
import ErrorBoundary from './components/ErrorBoundary';

function App() {

  return (
    <ErrorBoundary>
      <div className="relative w-screen h-screen bg-dark-bg overflow-hidden selection:bg-accent-purple/30">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/5 rounded-full blur-[120px]" />
        </div>

        {/* Main Layout */}
        <div className="relative items-center z-10 w-full h-full">
           <PipelineToolbar />
           <div className="w-full h-full"> 
               <PipelineUI />
           </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
