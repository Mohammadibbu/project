import React, { useState } from 'react';
import { Users, Copy, Star, Filter, Search, Clock, Target, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserSettings {
  role: 'developer' | 'pm' | 'designer' | 'analyst' | 'manager';
  workHours: { start: string; end: string };
  preferredSessionLength: number;
  mode: 'proactive' | 'reactive' | 'flexible';
  autoDeclineMeetings: boolean;
  focusBehavior: 'aggressive' | 'flexible';
  weeklyGoal: number;
  monthlyGoal: number;
}

interface FocusTemplate {
  id: string;
  name: string;
  description: string;
  role: string;
  team: string;
  schedule: {
    days: string[];
    timeSlots: { start: string; end: string; title: string }[];
  };
  weeklyHours: number;
  popularity: number;
  rating: number;
  tags: string[];
  author: string;
  usageCount: number;
}

interface TeamTemplatesBrowserProps {
  userSettings: UserSettings;
  onApplyTemplate: (template: FocusTemplate) => void;
}

const TeamTemplatesBrowser: React.FC<TeamTemplatesBrowserProps> = ({
  userSettings,
  onApplyTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');

  const templates: FocusTemplate[] = [
    {
      id: '1',
      name: 'Engineering Deep Work',
      description: 'Optimized schedule for developers with morning code blocks and afternoon reviews',
      role: 'Developer',
      team: 'Engineering',
      schedule: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        timeSlots: [
          { start: '09:00', end: '11:00', title: 'Deep Coding Session' },
          { start: '14:00', end: '15:30', title: 'Code Review & Documentation' }
        ]
      },
      weeklyHours: 22,
      popularity: 95,
      rating: 4.8,
      tags: ['coding', 'review', 'morning-focus'],
      author: 'Engineering Team',
      usageCount: 127
    },
    {
      id: '2',
      name: 'Product Strategy Sessions',
      description: 'Strategic planning blocks for product managers with stakeholder alignment time',
      role: 'Product Manager',
      team: 'Product',
      schedule: {
        days: ['Tuesday', 'Wednesday', 'Thursday'],
        timeSlots: [
          { start: '10:00', end: '12:00', title: 'Strategic Planning' },
          { start: '15:00', end: '16:00', title: 'Market Research' }
        ]
      },
      weeklyHours: 15,
      popularity: 87,
      rating: 4.6,
      tags: ['strategy', 'planning', 'research'],
      author: 'Product Team',
      usageCount: 89
    },
    {
      id: '3',
      name: 'Creative Design Blocks',
      description: 'Uninterrupted creative sessions for designers with inspiration and iteration time',
      role: 'Designer',
      team: 'Design',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        timeSlots: [
          { start: '09:30', end: '11:30', title: 'Creative Exploration' },
          { start: '14:30', end: '16:00', title: 'Design Iteration' }
        ]
      },
      weeklyHours: 19,
      popularity: 78,
      rating: 4.7,
      tags: ['creative', 'design', 'iteration'],
      author: 'Design Team',
      usageCount: 64
    },
    {
      id: '4',
      name: 'Data Analysis Deep Dive',
      description: 'Extended analysis sessions for data scientists and analysts',
      role: 'Analyst',
      team: 'Data Science',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        timeSlots: [
          { start: '08:00', end: '11:00', title: 'Data Analysis Marathon' },
          { start: '13:00', end: '15:00', title: 'Model Building' }
        ]
      },
      weeklyHours: 16,
      popularity: 82,
      rating: 4.5,
      tags: ['analysis', 'modeling', 'research'],
      author: 'Data Team',
      usageCount: 45
    },
    {
      id: '5',
      name: 'Leadership Focus Hours',
      description: 'Strategic thinking and planning time for managers and team leads',
      role: 'Manager',
      team: 'Management',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        timeSlots: [
          { start: '08:00', end: '09:30', title: 'Strategic Planning' },
          { start: '16:00', end: '17:00', title: 'Team Development' }
        ]
      },
      weeklyHours: 12,
      popularity: 73,
      rating: 4.4,
      tags: ['leadership', 'strategy', 'planning'],
      author: 'Leadership Team',
      usageCount: 38
    },
    {
      id: '6',
      name: 'Cross-Functional Collaboration',
      description: 'Balanced schedule for teams working across multiple functions',
      role: 'All Roles',
      team: 'Cross-functional',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        timeSlots: [
          { start: '10:00', end: '11:30', title: 'Individual Deep Work' },
          { start: '14:00', end: '15:00', title: 'Collaborative Planning' }
        ]
      },
      weeklyHours: 10,
      popularity: 68,
      rating: 4.3,
      tags: ['collaboration', 'flexible', 'cross-team'],
      author: 'Operations Team',
      usageCount: 92
    }
  ];

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = selectedRole === 'all' || 
                         template.role.toLowerCase().includes(selectedRole.toLowerCase()) ||
                         template.role === 'All Roles';
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
          return b.rating - a.rating;
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'hours':
          return b.weeklyHours - a.weeklyHours;
        default:
          return 0;
      }
    });

  const getRecommendedTemplates = () => {
    return templates.filter(template => 
      template.role.toLowerCase() === userSettings.role || 
      template.role === 'All Roles'
    ).slice(0, 3);
  };

  const handleApplyTemplate = (template: FocusTemplate) => {
    onApplyTemplate(template);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Templates</h2>
          <p className="text-muted-foreground">Discover and apply proven focus time schedules from teams</p>
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="usage">Usage Count</SelectItem>
                    <SelectItem value="hours">Weekly Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {template.role}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {template.team}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {template.weeklyHours}h/week
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Schedule Preview */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Schedule Preview</h4>
                    <div className="space-y-1">
                      {template.schedule.timeSlots.map((slot, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>{slot.title}</span>
                          <span className="text-muted-foreground">
                            {slot.start} - {slot.end}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Days: {template.schedule.days.join(', ')}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{template.usageCount} teams using</span>
                      <span>{template.popularity}% success rate</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleApplyTemplate(template)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Apply Template
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No templates found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or filters to find relevant templates.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your role as a {userSettings.role} and your {userSettings.weeklyGoal}h weekly goal
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getRecommendedTemplates().map((template) => (
              <Card key={template.id} className="p-6 border-primary/20 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="text-xs">
                      Perfect Match
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Weekly Hours</span>
                      <span className="text-sm font-bold text-primary">{template.weeklyHours}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-bold text-green-600">{template.popularity}%</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleApplyTemplate(template)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Apply This Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamTemplatesBrowser;