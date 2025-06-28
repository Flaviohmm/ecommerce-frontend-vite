
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchHeaderProps {
    onSearch: (term: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className="flex items-center gap-4 max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl"
                    >
                        Buscar
                    </Button>
                </form>
            </div>
        </div>
    );
};
