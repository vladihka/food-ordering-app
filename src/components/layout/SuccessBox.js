export default function SuccessBox({children}){
    return(
        <div className="text-center bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700/50 p-4">
            {children}
        </div>
    )
}
