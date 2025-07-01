<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique(); // Unique slug for SEO-friendly URLs
            $table->string('content_type')->default('text'); // 'text', 'video', 'quiz', etc.
            $table->text('content_url')->nullable(); // URL for video or quiz content
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->softDeletes(); // For soft deletion
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
