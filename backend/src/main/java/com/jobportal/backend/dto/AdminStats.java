package com.jobportal.backend.dto;

public class AdminStats {

    private long totalUsers;
    private long totalJobs;
    private long totalApplications;
    private long totalApplied;
    private long totalShortlisted;
    private long totalInterviewScheduled;
    private long totalInterviewed;
    private long totalOffered;
    private long totalHired;
    private long totalRejected;

    public AdminStats(long totalUsers,
                      long totalJobs,
                      long totalApplications,
                      long totalApplied,
                      long totalShortlisted,
                      long totalInterviewScheduled,
                      long totalInterviewed,
                      long totalOffered,
                      long totalHired,
                      long totalRejected) {

        this.totalUsers = totalUsers;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
        this.totalApplied = totalApplied;
        this.totalShortlisted = totalShortlisted;
        this.totalInterviewScheduled = totalInterviewScheduled;
        this.totalInterviewed = totalInterviewed;
        this.totalOffered = totalOffered;
        this.totalHired = totalHired;
        this.totalRejected = totalRejected;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public long getTotalApplied() {
        return totalApplied;
    }

    public long getTotalShortlisted() {
        return totalShortlisted;
    }

    public long getTotalInterviewScheduled() {
        return totalInterviewScheduled;
    }

    public long getTotalInterviewed() {
        return totalInterviewed;
    }

    public long getTotalOffered() {
        return totalOffered;
    }

    public long getTotalHired() {
        return totalHired;
    }

    public long getTotalRejected() {
        return totalRejected;
    }
}