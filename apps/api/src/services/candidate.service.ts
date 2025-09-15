import { prisma } from '../lib/database';
import { Prisma, CandidateStatus } from '@prisma/client';

interface CreateCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  companyId: string;
}

interface UpdateCandidateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  status?: CandidateStatus;
  consentGiven?: boolean;
}

interface CandidateFilters {
  status?: CandidateStatus;
  position?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class CandidateService {
  async createCandidate(data: CreateCandidateData) {
    // Check if candidate with same email exists in company
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        email: data.email,
        companyId: data.companyId
      }
    });

    if (existingCandidate) {
      throw new Error('Candidate with this email already exists in your company');
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: data.companyId }
    });

    if (!company || !company.isActive) {
      throw new Error('Invalid or inactive company');
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          }
        },
        screenings: {
          select: {
            id: true,
            status: true,
            riskLevel: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            screenings: true,
            socialProfiles: true,
          }
        }
      }
    });

    return candidate;
  }

  async getCandidateById(id: string, companyId: string) {
    const candidate = await prisma.candidate.findFirst({
      where: {
        id,
        companyId
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          }
        },
        screenings: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        socialProfiles: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            screenings: true,
            socialProfiles: true,
          }
        }
      }
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return candidate;
  }

  async getCandidates(companyId: string, filters: CandidateFilters = {}) {
    const {
      status,
      position,
      search,
      page = 1,
      limit = 20
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CandidateWhereInput = {
      companyId,
      ...(status && { status }),
      ...(position && { position: { contains: position, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } },
        ]
      })
    };

    // Get total count for pagination
    const total = await prisma.candidate.count({ where });

    // Get candidates
    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        screenings: {
          select: {
            id: true,
            status: true,
            riskLevel: true,
            overallScore: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Get latest screening only
        },
        _count: {
          select: {
            screenings: true,
            socialProfiles: true,
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    return {
      candidates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateCandidate(id: string, companyId: string, data: UpdateCandidateData) {
    // Check if candidate exists and belongs to company
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        id,
        companyId
      }
    });

    if (!existingCandidate) {
      throw new Error('Candidate not found');
    }

    // If email is being updated, check for duplicates
    if (data.email && data.email !== existingCandidate.email) {
      const emailExists = await prisma.candidate.findFirst({
        where: {
          email: data.email,
          companyId,
          id: { not: id }
        }
      });

      if (emailExists) {
        throw new Error('Another candidate with this email already exists');
      }
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...data,
        ...(data.consentGiven && { consentDate: new Date() })
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          }
        },
        screenings: {
          select: {
            id: true,
            status: true,
            riskLevel: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            screenings: true,
            socialProfiles: true,
          }
        }
      }
    });

    return updatedCandidate;
  }

  async deleteCandidate(id: string, companyId: string) {
    // Check if candidate exists and belongs to company
    const candidate = await prisma.candidate.findFirst({
      where: {
        id,
        companyId
      },
      include: {
        _count: {
          select: {
            screenings: true
          }
        }
      }
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Check if candidate has screenings
    if (candidate._count.screenings > 0) {
      throw new Error('Cannot delete candidate with existing screenings. Please archive instead.');
    }

    await prisma.candidate.delete({
      where: { id }
    });

    return { message: 'Candidate deleted successfully' };
  }

  async archiveCandidate(id: string, companyId: string) {
    const candidate = await this.updateCandidate(id, companyId, {
      status: CandidateStatus.REJECTED
    });

    return candidate;
  }

  async getCandidateStats(companyId: string) {
    const stats = await prisma.candidate.groupBy({
      by: ['status'],
      where: { companyId },
      _count: {
        status: true
      }
    });

    const totalCandidates = await prisma.candidate.count({
      where: { companyId }
    });

    const recentCandidates = await prisma.candidate.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    const withConsent = await prisma.candidate.count({
      where: {
        companyId,
        consentGiven: true
      }
    });

    return {
      total: totalCandidates,
      recentlyAdded: recentCandidates,
      withConsent,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
