import prisma from '../prisma/client';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  ListApplicationsQuery,
} from '../validators/application.validator';

export class ApplicationError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export const createApplication = async (userId: string, input: CreateApplicationInput) => {
  return prisma.jobApplication.create({
    data: {
      ...input,
      jobUrl: input.jobUrl || null,
      userId,
    },
  });
};

export const listApplications = async (userId: string, query: ListApplicationsQuery) => {
  const { status, search, page, limit } = query;

  const where = {
    userId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { company: { contains: search, mode: 'insensitive' as const } },
        { role: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      orderBy: { appliedDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getApplicationById = async (userId: string, applicationId: string) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new ApplicationError('Application not found', 404);
  }

  if (application.userId !== userId) {
    throw new ApplicationError('Application not found', 404);
  }

  return application;
};

export const updateApplication = async (
  userId: string,
  applicationId: string,
  input: UpdateApplicationInput
) => {
  await getApplicationById(userId, applicationId);

  return prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      ...input,
      ...(input.jobUrl !== undefined && { jobUrl: input.jobUrl || null }),
    },
  });
};

export const deleteApplication = async (userId: string, applicationId: string) => {
  await getApplicationById(userId, applicationId);
  await prisma.jobApplication.delete({ where: { id: applicationId } });
};

export const getApplicationStats = async (userId: string) => {
  const grouped = await prisma.jobApplication.groupBy({
    by: ['status'],
    where: { userId },
    _count: true,
  });

  const stats = { APPLIED: 0, INTERVIEWING: 0, OFFER: 0, REJECTED: 0 };
  grouped.forEach((g) => {
    stats[g.status] = g._count;
  });

  return {
    ...stats,
    total: Object.values(stats).reduce((sum, count) => sum + count, 0),
  };
};
