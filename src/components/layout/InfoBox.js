export default function InfoBox({children}){
    return(
        <div className="text-center bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-300 dark:border-blue-700/50">
            {children}
        </div>
    )
}