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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('tags')->nullable(); // Array of tags stored as JSON
            $table->json('what_you_will_learn')->nullable(); // Array of learning outcomes stored as JSON
            $table->integer('time_to_complete')->nullable(); // Estimated time in minutes
            $table->foreignId('course_category_id')->constrained()->onDelete('cascade'); // Foreign key to course categories
            $table->string('level')->nullable(); // Beginner, Intermediate, Advanced
            $table->softDeletes(); // For soft deletion
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
