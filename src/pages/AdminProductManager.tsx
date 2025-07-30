import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
    id?: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    rating?: number;
    inStock: boolean;
    description: string;
    stockQuantity: number;
}

// Componente para Input com máscara de valor monetário
const CurrencyInput: React.FC<{
    value?: number;
    onChange?: (value: number) => void;
    placeholder?: string;
    id?: string;
    className?: string;
}> = ({ value, onChange, placeholder, id, className }) => {
    const [displayValue, setDisplayValue] = useState('');

    const formatCurrency = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return '';
        const number = parseInt(numbers) / 100;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(number);
    };

    const parseCurrency = (formattedValue: string): number => {
        const numbers = formattedValue.replace(/\D/g, '');
        if (!numbers) return 0;
        return parseInt(numbers) / 100;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formatted = formatCurrency(inputValue);
        setDisplayValue(formatted);
        if (onChange) {
            const numericValue = parseCurrency(formatted);
            onChange(numericValue);
        }
    };

    React.useEffect(() => {
        if (typeof value === 'number' && value > 0) {
            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2
            }).format(value);
            setDisplayValue(formatted);
        } else if (!value || value === 0) {
            setDisplayValue('');
        }
    }, [value]);

    return (
        <Input
            id={id}
            value={displayValue}
            onChange={handleInputChange}
            placeholder={placeholder || "R$ 0,00"}
            className={className}
        />
    );
};

const AdminProductManager: React.FC = () => {
    // Simulação de contexto de autenticação
    const { user, token, isAdmin, isAuthenticated } = useAuth();

    // Função simulada para requisições autenticadas
    const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    headers[key] = value;
                }
            });
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            ...options,
            headers,
        });
    };
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Estado do formulário
    const [formData, setFormData] = useState<Product>({
        name: '',
        price: 0,
        originalPrice: 0,
        image: '',
        category: '',
        rating: 5,
        inStock: true,
        description: '',
        stockQuantity: 0
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'];

    // Verificar se é admin
    if (!isAdmin()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
                        <p className="text-gray-600 dark:text-gray-400">Apenas adminstradores podem acessar esta página.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Carregar produtos
    const loadProducts = async () => {
        if (!token) {
            setError('Token de autenticação não encontrado. Faça login novamente.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authenticatedFetch('http://localhost:8080/api/admin/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setError('');
                console.log('Produtos carregados:', data);
            } else {
                // Tratamento específico para diferentes códigos de erro
                let errorMessage = 'Erro ao carregar produtos';

                switch (response.status) {
                    case 401:
                        errorMessage = 'Token expirado ou inválido. Faça login novamente.';
                        break;
                    case 403:
                        errorMessage = 'Acesso negado. Verifique suas permissões de administrador.';
                        break;
                    case 404:
                        errorMessage = 'Endpoint não encontrado. Verifique se o servidor está rodando.';
                        break;
                    case 500:
                        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
                        break;
                    default:
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.error || errorData.message || errorMessage;
                        } catch {
                            // Se não conseguir parsear o JSON, usa a mensagem padrão
                        }
                }

                setError(errorMessage);
                console.error('Erro ao carregar produtos:', { status: response.status, errorMessage });
            }
        } catch (err) {
            const errorMessage = 'Erro de conexão com o servidor. Verifique se o backend está rodando.';
            setError(errorMessage);
            console.error('Erro de conexão:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Validação do formulário
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
        if (formData.price <= 0) errors.price = 'Preço deve ser positivo';
        if (formData.originalPrice <= 0) errors.originalPrice = 'Preço original deve ser positivo';
        if (!formData.image.trim()) errors.image = 'URL da imagem é obrigatória';
        if (!formData.category.trim()) errors.category = 'Categoria é obrigatória';
        if (!formData.description.trim()) errors.description = 'Descrição é obrigatória';
        if (formData.stockQuantity < 0) errors.stockQuantity = 'Quantidade deve ser positiva';
        if (formData.rating && (formData.rating < 0 || formData.rating > 5)) errors.rating = 'Avaliação deve estar entre 0 e 5';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Reset de mensagens
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    // Manipular mudanças no formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    // Criar/Atualizar produto
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const url = editingProduct
                ? `http://localhost:8080/api/admin/products/${editingProduct.id}`
                : 'http://localhost:8080/api/admin/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await authenticatedFetch(url, {
                method,
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
                setShowForm(false);
                setEditingProduct(null);
                resetForm();
                loadProducts();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Erro ao salvar produto');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    // Deletar produto
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este produto?')) return;

        clearMessages();
        setLoading(true);

        try {
            const response = await authenticatedFetch(`http://localhost:8080/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSuccess('Produto deletado com sucesso!');
                loadProducts();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Erro ao deletar produto');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    // Editar produto
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setShowForm(true);
        setFormErrors({});
    };

    // Reset do formulário
    const resetForm = () => {
        setFormData({
            name: '',
            price: 0,
            originalPrice: 0,
            image: '',
            category: '',
            rating: 5,
            inStock: true,
            description: '',
            stockQuantity: 0
        });
        setFormErrors({});
    };

    // Cancelar edição
    const handleCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        clearMessages();
    };

    // Formatação de moeda para exibição
    const formatCurrencyDisplay = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-black rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Painel Administrativo</h1>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Produto
                            </Button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                {/* Formulário de Produtos */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nome do Produto</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Digite o nome do produto"
                                        />
                                        {formErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Categoria</Label>
                                        <Select
                                            name="category"
                                            value={formData.category}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {formErrors.category && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="price">Preço (R$)</Label>
                                        <CurrencyInput
                                            id="price"
                                            value={formData.price}
                                            onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                                            placeholder="R$ 0,00"
                                        />
                                        {formErrors.price && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                                        <CurrencyInput
                                            id="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={(value) => setFormData(prev => ({ ...prev, originalPrice: value }))}
                                            placeholder="R$ 0,00"
                                        />
                                        {formErrors.originalPrice && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.originalPrice}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
                                        <Input
                                            type="number"
                                            name="stockQuantity"
                                            value={formData.stockQuantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="0"
                                        />
                                        {formErrors.stockQuantity && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.stockQuantity}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="rating">Avaliação (0-5)</Label>
                                        <Input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            placeholder="5.0"
                                        />
                                        {formErrors.rating && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.rating}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="image">URL da Imagem</Label>
                                        <Input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://exemplo.com/imagem.jpg"
                                        />
                                        {formErrors.image && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descrição</Label>
                                        <Textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Descrição detalhada do produto"
                                            rows={3}
                                        />
                                        {formErrors.description && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="inStock"
                                            checked={formData.inStock}
                                            onCheckedChange={(checked) => {
                                                setFormData(prev => ({ ...prev, inStock: checked }));
                                            }}
                                        />
                                        <Label htmlFor="inStock">Produto em estoque</Label>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700"
                                            disabled={loading}
                                        >
                                            {loading ? 'Salvando...' : editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de Produtos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Produtos Cadastrados ({products.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading && !showForm ? (
                            <div className="p-6 text-center">Carregando produtos...</div>
                        ) : products.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">Nenhum produto encontrado</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead>Preço</TableHead>
                                            <TableHead>Estoque</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Avaliação</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>{formatCurrencyDisplay(product.price)}</TableCell>
                                                <TableCell>{product.stockQuantity}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock && product.stockQuantity > 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {product.inStock && product.stockQuantity > 0 ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3" />
                                                                Em Estoque
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3" />
                                                                Esgotado
                                                            </>
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{product.rating}/5</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size={`sm`}
                                                            variant={`outline`}
                                                            onClick={() => product.id && handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminProductManager;