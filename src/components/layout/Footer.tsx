export default function Footer() {
    return (
        <div className="bg-[#d4e6d4] border-t-2 border-[#90c090] p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="text-sm text-gray-600">
                    Copyright © 2025 <a href="https://codigomate.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CodigoMate</a>
                </p>
                <p className="text-sm text-gray-600">
                    <a href="https://github.com/martin2844/board" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Github
                    </a>
                </p>
            </div>
        </div>
    )
}