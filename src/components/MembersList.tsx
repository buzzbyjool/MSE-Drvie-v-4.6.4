import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { User } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Region } from '../types/airtable';
import { usersTable, updateUserProfile } from '../services/airtable/users';
import MemberDetails from './MemberDetails';

interface Member {
  id: string;
  Avatar?: string;
  Nom: string;
  Prenom: string;
  Pseudo: string;
  Region: Region;
  Rang: string;
  Email?: string;
  Telephone?: string;
  Abonnement?: 'Active' | 'Pending' | 'Unpaid';
  Address?: string;
  Status: string;
  Grade?: string;
  CarModel?: string;
  Car_number?: string;
}

type SortOption = 'name' | 'region' | 'role';

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { isAdmin } = usePermissions();

  const fetchMembers = async () => {
    try {
      const records = await usersTable
        .select({
          filterByFormula: "{Status} = 'Active'",
          sort: [{ field: 'Nom', direction: 'asc' }],
          fields: ['Avatar', 'Nom', 'Prenom', 'Region', 'Rang', 'Email', 'Telephone', 'Address', 'Status', 'Grade', 'Pseudo', 'CarModel', 'Abonnement', 'Car_number']
        })
        .all();

      const membersList = records.map(record => ({
        id: record.id,
        Avatar: (record.get('Avatar') as any[])?.[0]?.url,
        Nom: record.get('Nom') as string,
        Prenom: record.get('Prenom') as string,
        Pseudo: record.get('Pseudo') as string,
        Region: record.get('Region') as Region,
        Rang: record.get('Rang') as string,
        Email: record.get('Email') as string,
        Telephone: record.get('Telephone') as string,
        Address: record.get('Address') as string,
        Status: record.get('Status') as string,
        Grade: (record.get('Grade') as any[])?.[0]?.url,
        CarModel: record.get('CarModel') as string,
        Abonnement: record.get('Abonnement') as Member['Abonnement'],
        Car_number: record.get('Car_number') as string
      }));

      setMembers(membersList);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleUpdateMember = async (memberId: string, updates: any) => {
    try {
      await updateUserProfile(memberId, updates);
      await fetchMembers();
      
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.Nom} ${a.Prenom}`.localeCompare(`${b.Nom} ${b.Prenom}`);
      case 'region':
        return a.Region.localeCompare(b.Region);
      case 'role':
        return a.Rang.localeCompare(b.Rang);
      default:
        return 0;
    }
  });

  if (selectedMember) {
    return (
      <MemberDetails
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
        onUpdate={(updates) => handleUpdateMember(selectedMember.id, updates)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-100">Club Members</h1>
            <p className="text-gray-400">{members.length} Members</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="name">Sort by Name</option>
              <option value="region">Sort by Region</option>
              <option value="role">Sort by Role</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 text-red-100 mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden 
                       relative p-6 cursor-pointer hover:border-lime-500 
                       hover:shadow-lime-500/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                {member.Avatar ? (
                  <img
                    src={member.Avatar}
                    alt={`${member.Prenom} ${member.Nom}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-lime-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center border-2 border-lime-500">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-100">
                    {member.Prenom} {member.Nom}
                  </h2>
                  <p className="text-lime-500 font-medium">{member.Rang}</p>
                  <p className="text-gray-400">{member.Region}</p>
                </div>
              </div>

              {member.Grade && (
                <div className="absolute bottom-4 right-4">
                  <img
                    src={member.Grade}
                    alt="Member Grade"
                    className="w-12 h-12 rounded-lg object-cover border-2 border-lime-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400">No active members found</p>
          </div>
        )}
      </div>
    </div>
  );
}