import { useState, useEffect, useRef, useCallback } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import Search from '@arcgis/core/widgets/Search';
import Locate from '@arcgis/core/widgets/Locate';
import '@arcgis/core/assets/esri/themes/light/main.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Upload, X, AlertTriangle, Layers, Navigation, ImagePlus, Send, ChevronLeft, ChevronRight } from 'lucide-react';

interface Complaint {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  address?: string;
}

const CATEGORIES = [
  {
    id: 'roads',
    label: 'Roads & Highways',
    icon: '🛣️',
    color: '#e74c3c',
    subcategories: ['Potholes', 'Cracks', 'Flooding', 'Missing Signs', 'Broken Barriers', 'Street Light Out'],
  },
  {
    id: 'water',
    label: 'Water & Drainage',
    icon: '💧',
    color: '#3498db',
    subcategories: ['Pipe Leak', 'Blocked Drain', 'Contaminated Water', 'No Water Supply', 'Overflowing Manhole'],
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: '⚡',
    color: '#f39c12',
    subcategories: ['Power Outage', 'Exposed Wires', 'Transformer Issue', 'Broken Pole', 'Faulty Meter'],
  },
  {
    id: 'waste',
    label: 'Waste Management',
    icon: '🗑️',
    color: '#27ae60',
    subcategories: ['Garbage Overflow', 'Illegal Dumping', 'Missed Collection', 'Hazardous Waste'],
  },
  {
    id: 'public-safety',
    label: 'Public Safety',
    icon: '🚨',
    color: '#8e44ad',
    subcategories: ['Broken Sidewalk', 'Missing Railing', 'Unsafe Structure', 'Abandoned Vehicle'],
  },
];

// Demo complaints data
const DEMO_COMPLAINTS: Complaint[] = [
  {
    id: '1', category: 'roads', subcategory: 'Potholes', title: 'Large pothole on Main Street',
    description: 'A dangerous pothole approximately 2 feet wide causing traffic issues.',
    latitude: 17.385, longitude: 78.4867, images: [], status: 'open', createdAt: '2026-02-10', address: 'Main Street, Hyderabad',
  },
  {
    id: '2', category: 'roads', subcategory: 'Street Light Out', title: 'No street light at junction',
    description: 'Street light has been out for 2 weeks at the major junction.',
    latitude: 17.39, longitude: 78.49, images: [], status: 'in-progress', createdAt: '2026-02-08', address: 'Tank Bund Road, Hyderabad',
  },
  {
    id: '3', category: 'water', subcategory: 'Pipe Leak', title: 'Water pipe burst near park',
    description: 'Major water pipe leak flooding the area near city park.',
    latitude: 17.383, longitude: 78.48, images: [], status: 'open', createdAt: '2026-02-12', address: 'Necklace Road, Hyderabad',
  },
  {
    id: '4', category: 'electricity', subcategory: 'Exposed Wires', title: 'Dangerous exposed electrical wires',
    description: 'Exposed wires hanging low near a school zone. Immediate attention needed.',
    latitude: 17.388, longitude: 78.492, images: [], status: 'open', createdAt: '2026-02-11', address: 'Begumpet, Hyderabad',
  },
  {
    id: '5', category: 'waste', subcategory: 'Garbage Overflow', title: 'Overflowing garbage bins',
    description: 'Multiple garbage bins overflowing near residential area.',
    latitude: 17.38, longitude: 78.485, images: [], status: 'resolved', createdAt: '2026-02-05', address: 'Banjara Hills, Hyderabad',
  },
];

const GISComplaints = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [complaints, setComplaints] = useState<Complaint[]>(DEMO_COMPLAINTS);
  const [showForm, setShowForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    category: '', subcategory: '', title: '', description: '',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({ basemap: 'streets-navigation-vector' });

    const graphicsLayer = new GraphicsLayer({ title: 'Complaints' });
    graphicsLayerRef.current = graphicsLayer;
    map.add(graphicsLayer);

    // ArcGIS public feature layers for context
    const roadsLayer = new FeatureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System_2022/FeatureServer/0',
      title: 'Highway Network',
      visible: false,
      opacity: 0.6,
    });
    map.add(roadsLayer);

    const view = new MapView({
      container: mapRef.current,
      map,
      center: [78.4867, 17.385], // Hyderabad
      zoom: 13,
      ui: { components: ['zoom', 'compass'] },
    });

    viewRef.current = view;

    // Widgets
    const search = new Search({ view });
    view.ui.add(search, 'top-right');

    const locate = new Locate({ view });
    view.ui.add(locate, 'top-left');

    const basemapToggle = new BasemapToggle({ view, nextBasemap: 'satellite' });
    view.ui.add(basemapToggle, 'bottom-right');

    // Click handler to place complaint
    view.on('click', (event) => {
      setClickedLocation({ lat: event.mapPoint.latitude, lng: event.mapPoint.longitude });
      setShowForm(true);
    });

    return () => {
      view.destroy();
    };
  }, []);

  // Update complaint markers on map
  const updateMarkers = useCallback(() => {
    const gl = graphicsLayerRef.current;
    if (!gl) return;
    gl.removeAll();

    const filtered = selectedCategory === 'all'
      ? complaints
      : complaints.filter(c => c.category === selectedCategory);

    filtered.forEach(complaint => {
      const cat = CATEGORIES.find(c => c.id === complaint.category);
      const statusColors: Record<string, string> = {
        'open': cat?.color || '#e74c3c',
        'in-progress': '#f39c12',
        'resolved': '#27ae60',
      };

      const point = new Point({ longitude: complaint.longitude, latitude: complaint.latitude });
      const symbol = new SimpleMarkerSymbol({
        color: statusColors[complaint.status],
        size: 14,
        outline: { color: 'white', width: 2 },
      });

      const popup = new PopupTemplate({
        title: `${cat?.icon || '📍'} ${complaint.title}`,
        content: `
          <div style="font-family: sans-serif;">
            <p><b>Category:</b> ${cat?.label} → ${complaint.subcategory}</p>
            <p><b>Status:</b> <span style="color: ${statusColors[complaint.status]}; font-weight: bold;">${complaint.status.toUpperCase()}</span></p>
            <p><b>Description:</b> ${complaint.description}</p>
            <p><b>Address:</b> ${complaint.address || 'N/A'}</p>
            <p><b>Reported:</b> ${complaint.createdAt}</p>
          </div>
        `,
      });

      const graphic = new Graphic({ geometry: point, symbol, popupTemplate: popup });
      gl.add(graphic);
    });
  }, [complaints, selectedCategory]);

  useEffect(() => { updateMarkers(); }, [updateMarkers]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (uploadedImages.length + files.length > 5) {
      toast({ title: 'Limit Reached', description: 'Maximum 5 images allowed', variant: 'destructive' });
      return;
    }
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!clickedLocation || !formData.category || !formData.title) {
      toast({ title: 'Missing Fields', description: 'Please select location, category and title', variant: 'destructive' });
      return;
    }

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      ...formData,
      latitude: clickedLocation.lat,
      longitude: clickedLocation.lng,
      images: uploadedImages,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setComplaints(prev => [...prev, newComplaint]);
    setShowForm(false);
    setClickedLocation(null);
    setFormData({ category: '', subcategory: '', title: '', description: '' });
    setUploadedImages([]);

    toast({ title: '✅ Complaint Raised', description: 'Your complaint has been geo-tagged and submitted successfully.' });

    // Zoom to complaint
    viewRef.current?.goTo({ center: [newComplaint.longitude, newComplaint.latitude], zoom: 16 }, { duration: 1000 });
  };

  const filteredComplaints = selectedCategory === 'all'
    ? complaints
    : complaints.filter(c => c.category === selectedCategory);

  const statusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'open': 'bg-red-500/10 text-red-600 border-red-200',
      'in-progress': 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
      'resolved': 'bg-green-500/10 text-green-600 border-green-200',
    };
    return <Badge className={`${variants[status]} text-[10px] px-1.5`}>{status}</Badge>;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="bg-card border-b px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">GIS Complaints Portal</h1>
          <Badge variant="outline" className="text-[10px]">ArcGIS Powered</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{filteredComplaints.length} complaints</Badge>
          <Button size="sm" onClick={() => { setShowForm(true); }} className="gap-1 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" /> Raise Complaint
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-10' : 'w-80'} transition-all duration-300 bg-card border-r flex flex-col shrink-0 relative`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {!sidebarCollapsed && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Category Filter */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Categories</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-accent'}`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-[11px] px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${selectedCategory === cat.id ? 'text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-accent'}`}
                      style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complaints List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {filteredComplaints.map(c => {
                  const cat = CATEGORIES.find(ct => ct.id === c.category);
                  return (
                    <Card
                      key={c.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border"
                      onClick={() => {
                        viewRef.current?.goTo({ center: [c.longitude, c.latitude], zoom: 16 }, { duration: 800 });
                      }}
                    >
                      <CardContent className="p-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{cat?.icon} {c.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{cat?.label} → {c.subcategory}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{c.address}</p>
                          </div>
                          {statusBadge(c.status)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredComplaints.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-xs">No complaints in this category</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />

          {/* Complaint Form Overlay */}
          {showForm && (
            <div className="absolute top-4 right-4 z-50 w-96 max-h-[calc(100vh-120px)] overflow-y-auto">
              <Card className="shadow-2xl border-2 border-primary/20">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Raise a Complaint
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowForm(false); setClickedLocation(null); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {/* Location indicator */}
                  {clickedLocation ? (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2">
                      <Navigation className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-[11px] font-medium text-green-700 dark:text-green-400">Location Tagged</p>
                        <p className="text-[10px] text-green-600 dark:text-green-500">
                          {clickedLocation.lat.toFixed(5)}, {clickedLocation.lng.toFixed(5)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                      <MapPin className="h-4 w-4 text-yellow-600" />
                      <p className="text-[11px] text-yellow-700 dark:text-yellow-400">Click on the map to tag the issue location</p>
                    </div>
                  )}

                  {/* Category */}
                  <div className="space-y-1">
                    <Label className="text-xs">Category *</Label>
                    <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val, subcategory: '' }))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="text-xs">{cat.icon} {cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subcategory */}
                  {formData.category && (
                    <div className="space-y-1">
                      <Label className="text-xs">Issue Type *</Label>
                      <Select value={formData.subcategory} onValueChange={(val) => setFormData(prev => ({ ...prev, subcategory: val }))}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.find(c => c.id === formData.category)?.subcategories.map(sub => (
                            <SelectItem key={sub} value={sub} className="text-xs">{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-1">
                    <Label className="text-xs">Title *</Label>
                    <Input
                      className="h-8 text-xs"
                      placeholder="Brief title of the issue"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      className="text-xs min-h-[60px]"
                      placeholder="Describe the issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1">
                    <Label className="text-xs">Upload Photos (max 5)</Label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                          <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full h-4 w-4 flex items-center justify-center"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                      {uploadedImages.length < 5 && (
                        <label className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <ImagePlus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-[8px] text-muted-foreground mt-0.5">Add</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <Button onClick={handleSubmit} className="w-full gap-1.5 text-xs h-9" disabled={!clickedLocation}>
                    <Send className="h-3.5 w-3.5" /> Submit Complaint
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-card/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">STATUS</p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-full bg-red-500" /><span className="text-[10px]">Open</span></div>
              <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-full bg-yellow-500" /><span className="text-[10px]">In Progress</span></div>
              <div className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-full bg-green-500" /><span className="text-[10px]">Resolved</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISComplaints;
