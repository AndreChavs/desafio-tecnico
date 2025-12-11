interface PropsLoading{
    loading: boolean;    
}

export function FullscreenLoading({loading}:PropsLoading) {    
  return <>
    {loading && <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>}    
  </>;
}